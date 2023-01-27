import { readLines } from "https://deno.land/std@0.174.0/io/buffer.ts";
import { StringReader } from "https://deno.land/std@0.174.0/io/string_reader.ts";
import { crypto, DigestAlgorithm } from "https://deno.land/std@0.174.0/crypto/crypto.ts";
import { encode } from "https://deno.land/std@0.174.0/encoding/base64.ts";

const date = new Date();

const build = {
    arch: Deno.build.os + " " + Deno.build.arch,
    date: date.toISOString(),
    // https://calver.org/ YYYY.MM.DD
    version: date.getFullYear() + "." + (date.getMonth() + 1) + "." + date.getUTCDate(),
    module_algo: "SHA-512",
    module_hash: "",
    dict_algo: "MD5",
    dict_hash: "",
};

// Process dict files

/**
 * Create a searchable JSON structure from the Dwarven dictionary created by VABritto:
 * @link http://www.bay12forums.com/smf/index.php?action=profile;u=124675
 *
 * Sources:
 * @link http://www.bay12forums.com/smf/index.php?topic=173289.msg8005094#msg8005094
 * @link http://www.bay12forums.com/smf/index.php?topic=173289.msg8005410#msg8005410
 */

const dwarven = new StringReader(await Deno.readTextFile("dwarven.txt"));
const records = {};

for await (const line of readLines(dwarven)) {
    const parts = line.split(" - ");
    const eng = parts[1].trim().split(",");
    eng.forEach((el) => el.trim()); // clean up some ugly whitespace
    records[parts[0].trim()] = eng;
}

const dwarven_dict = JSON.stringify(records);

build.dict_hash = encode(
    new Uint8Array(
        await crypto.subtle.digest(
            build.dict_algo as DigestAlgorithm,
            Uint8Array.from(dwarven_dict.split("").map((x) => x.charCodeAt(0))),
        ),
    ),
);

await Deno.writeTextFile(`web/json/dwa-to-eng.${build.dict_hash}.json`, dwarven_dict);

// index.html integrity and dict version

const mjs_integrity = await Deno.readTextFile("web/modules/main.mjs");

build.module_hash = encode(
    new Uint8Array(
        await crypto.subtle.digest(
            build.module_algo as DigestAlgorithm,
            Uint8Array.from(mjs_integrity.split("").map((x) => x.charCodeAt(0))),
        ),
    ),
);

let index = await Deno.readTextFile("bin/index.html.tpl");

index = index.replace("#VERSION#", build.version)
    .replace("#ARCH#", build.arch)
    .replace("#DATE#", build.date)
    .replace("#MODULE_ALGO#", build.module_algo.replace("-", "").toLowerCase())
    .replace("#MODULE_HASH#", build.module_hash)
    .replace("#DICT_HASH#", build.dict_hash);

await Deno.writeTextFile(`web/index.html`, index);

// wrap up

await Deno.writeTextFile(`build.json`, JSON.stringify(build));

console.info(" Done.");
