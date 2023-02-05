import { readLines } from "https://deno.land/std@0.174.0/io/buffer.ts";
import { StringReader } from "https://deno.land/std@0.174.0/io/string_reader.ts";
import { crypto, DigestAlgorithm } from "https://deno.land/std@0.174.0/crypto/crypto.ts";
import { encode } from "https://deno.land/std@0.174.0/encoding/base64.ts";
import { encodeToString } from "https://deno.land/std@0.97.0/encoding/hex.ts";
import { emptyDirSync } from "https://deno.land/std@0.174.0/fs/mod.ts";

async function writeFile(filename: string, content: string): Promise<void> {
    try {
        await Deno.writeTextFile(
            filename,
            content,
            {
                create: true,
            },
        );
    } catch (e) {
        console.error(" " + e.toString());
        Deno.exit(1);
    }
}

const date = new Date();

const build = {
    arch: Deno.build.os + " " + Deno.build.arch,
    date: date.toISOString(),
    // https://calver.org/ YYYY.MM
    version: date.getFullYear() + "." + (date.getMonth() + 1),
    module_algo: "SHA-512",
    module_hash: "",
    dict_algo: "MD5",
    dwa_to_eng_dict_hash: "",
    dwa_dict_hash: "",
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

const source = new StringReader(await Deno.readTextFile("dwarven.txt"));
const dwa_to_eng = {};
const dwa = {};

for await (const line of readLines(source)) {
    const parts = line.split(" - ");
    const eng = parts[1].trim().split(",");

    dwa[parts[0].trim()] = eng;

    // clean up words from source
    dwa_to_eng[parts[0].trim()] = eng.map(
        (el) => {
            return el.replace("(n.)", "")
                .replace("(v.)", "")
                .trim();
        },
    );
}

const dwa_to_eng_json = JSON.stringify(dwa_to_eng);
const dwa_json = JSON.stringify(dwa);

build.dwa_to_eng_dict_hash = encodeToString(
    new Uint8Array(
        await crypto.subtle.digest(
            build.dict_algo as DigestAlgorithm,
            Uint8Array.from(dwa_to_eng_json.split("").map((x) => x.charCodeAt(0))),
        ),
    ),
);

build.dwa_dict_hash = encodeToString(
    new Uint8Array(
        await crypto.subtle.digest(
            build.dict_algo as DigestAlgorithm,
            Uint8Array.from(dwa_json.split("").map((x) => x.charCodeAt(0))),
        ),
    ),
);

emptyDirSync("web/json"); // empty end/or create

writeFile(`web/json/dwa-to-eng.${build.dwa_to_eng_dict_hash}.json`, dwa_to_eng_json).then();
writeFile(`web/json/dwa.${build.dwa_dict_hash}.json`, dwa_json).then();

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
    .replace("#DWA_TO_ENG_DICT_HASH#", build.dwa_to_eng_dict_hash)
    .replace("#DWA_DICT_HASH#", build.dwa_dict_hash);

writeFile(`web/index.html`, index).then();

// wrap up

writeFile(`build.json`, JSON.stringify(build)).then();

console.info(" Done.");
Deno.exit(0);
