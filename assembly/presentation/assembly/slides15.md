
NASM
----
* Netwide Assembler
    - Syntaxe inspirována TASM a MASM
* Původní autor *Simon Tatham* (PuTTY...)
* Generuje objektový kód pro platformu x86 (16bit, 32bit, 64bit)
    - Zjednodušený toolchain
        - `nasm` → flat file (.COM, bootloader...)
        - `nasm` → `ln` → spustitelný_soubor
