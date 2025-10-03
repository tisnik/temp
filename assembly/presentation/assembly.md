Assembler
---------
 
```
   _____                              ___.   .__                
  /  _  \   ______ ______ ____   _____\_ |__ |  |   ___________ 
 /  /_\  \ /  ___//  ___// __ \ /     \| __ \|  | _/ __ \_  __ \
/    |    \\___ \ \___ \\  ___/|  Y Y  \ \_\ \  |_\  ___/|  | \/
\____|__  /____  >____  >\___  >__|_|  /___  /____/\___  >__|   
        \/     \/     \/     \/      \/    \/          \/       
```
 
* Pavel Tišnovský
    - `tisnik@centrum.cz`
* Datum: 2025-xx-yy

Proč assembler?
---------------
1. Větší efektivita využití CPU
2. Rychlejší (a predikovatelné) přerušovací rutiny
3. Efektivita při práci s pamětí (cache+RAM)
4. Kompaktní kód
5. Mnohdy jeden z mála prostředků využití SIMD a dalších
   rozšíření (carry, CRC, hash, crypto instrukce)
6. Kód pro velmi malé/pomalé mikrořadiče
7. Lepší pochopení práce s gdb a dalšími debuggery
Některé požadavky se mohou vzájemně vylučovat!

Použití assembleru v minulosti
------------------------------
▶ První generace mainframů
    - vývojové diagramy v roli „vyššího jazyka“
    - assembler
    - strojový kód (zpočátku ruční překlad!)
▶ Mainframy a později minipočítače
    - přechod k vyšším programovacím jazykům
    - levnější vývoj, šance na přenositelnost
▶ Osmibitové herní konzole
    - assembler jediná rozumná volba
▶ Domácí mikropočítače
    - návrat „ke kořenům“
    - prakticky jediná volba pro profesionální aplikace
▶ Osobní mikropočítače
    - Motorola 68000
    - 8086/80286...
    - specifické použití assembleru (hry, dema, ...)
▶ DSP
    - výpočetní subrutiny (FFT...)
    - přerušovací rutiny

Použití assembleru v současnosti
--------------------------------
1. Firmware
2. Kód pracující přímo s HW (senzory, CPU+FPGA)
3. Bootstraping
4. DSP a MCU - rychlé přerušovací rutiny!
5. Instrukce nedostupné ve vyšším programovacím jazyce
6. Specifické subrutiny
    - SIMD
    - SSE
    - rotace
    - hledání vzorků
    - hledání podobných vektorů (RAG)
7. Zpracování signálů
8. Kodeky
9. Virtuální stroje generující strojový kód
10. Reverse engineering :-)
11. Samomodifikující se kód
12. Fingerprints (A86)

Instrukce nedostupné ve vyšším programovacím jazyce
---------------------------------------------------
▶ GCC nabízí ve formě „builtins“
    __builtin_clz
    __builtin_parity
    __builtin_bswap64
    a desítky/stovky dalších
▶ mohou se lišit podle platformy (x86, x86-64, AArch64...)

Použití assembleru v současnosti
--------------------------------
▶ Většinou velmi SPECIFICKÉ pro určitou oblast
▶ Naprostá většina aplikací není psána pouze v assembleru
    Coreboot: většinou C, jen zhruba 1% asm
    Důvod: výhody vyšších programovacích jazyků + snadnější audit kódu

Příklad
-------
x264 naprogramovaný v assembleru

Hodnocení „popularity“ assembleru 1/2
-------------------------------------
OpenHub
cca 0,5% projektů, <0,2% commitů
 
Hodnocení „popularity“ assembleru 2/2
-------------------------------------
Tiobe index
Sep 2025  Sep 2024  Programming Language  Ratings   Change
1         1         Python                25.98%    +5.81%
2         2         C++                   8.80%     -1.94%
3         4         C                     8.65%     -0.24%
4         3         Java                  8.35%     -1.09%
5         5         C#                    6.38%     +0.30%
6         6         JavaScript            3.22%     -0.70%
7         7         Visual Basic          2.84%     +0.14%
8         8         Go                    2.32%     -0.03%
9         11        Delphi/Object Pascal  2.26%     +0.49%
10        27        Perl                  2.03%     +1.33%
11        9         SQL                   1.86%     -0.08%
12        10        Fortran               1.49%     -0.29%
13        15        R                     1.43%     +0.23%
14        26        Ada                   1.27%     +0.56%
15        13        PHP                   1.25%     -0.20%
16        17        Scratch               1.18%     +0.07%
17        21        Assembly language     1.04%     +0.05%
18        14        Rust                  1.01%     -0.31%
19        12        MATLAB                0.98%     -0.49%
20        18        Kotlin                0.95%     -0.14%

Role assembleru
---------------
▶ Několik úrovní abstrakce (vrstev nad HW)
5   uživatelské aplikace
4½  (skriptovací engine)
4   vyšší programovací jazyk
3   assembler
2   strojový kód
1   syscalls
0   HW

Závislost na platformě
----------------------
5   uživatelské aplikace
4½  (skriptovací engine)
4   vyšší programovací jazyk
    ↑↑↑ nezávislý ↑↑↑
    ↓↓↓ závislý ↓↓↓
3   assembler
2   strojový kód
1   syscalls
0   HW

Přenositelnost programů psaných v assembleru
--------------------------------------------
* Obecně jsou programy nepřenositelné na jiné architektury
* Nízkoúrovňové volání funkcí OS je opět nepřenositelné
* Navíc existují pro kombinace arch+OS různé assemblery
* (zapomeňte na "univerzální assembler" typu C :-)

"Hello world"
-------------
* Různé architektury
    - od historických po ty nejmodernější
* Různé operační systémy
* Různé assemblery
* ... a přece podobná řešení

Kdy a proč vůbec psát v assembleru?
-----------------------------------
* Vyšší výkon specifického kódu
* Seřazeno podle důležitosti a podle specificity
    1. Použití lepšího algoritmu (vyšší programovací jazyk)
        - čas/použití paměti
    2. Použití překladače, ne intepretru (či mixu typu JVM)
    3. Operace s vektory (záleží na podpoře překladače)
    4. Optimalizace nabízené překladačem + jejich kombinace
        - některé optimalizace se ovšem částečně vylučují (-Os, -O3)
    5. Hinty pro překladač (nutno odzkoušet, zda mají význam)
        - `const`, `const *`, `register`, `__restrict__`
    6. Profilování (!)
    7. Speciální vlastnosti konkrétního překladače (nepřenositelné!)
        - `__builtin_expect`, `__builtin_unreachable`, `__builtin_prefetch`...
        - `hot` atribut u funkcí, `pure` atribut, `simd` apod.
        - https://gcc.gnu.org/onlinedocs/gcc/Common-Function-Attributes.html#Common-Function-Attributes
    8. Přepis RELEVANTNÍHO kódu do assembleru

Assembler a Linux
-----------------
* as    (*GNU Assembler*, *GAS*)
* NASM  (*Netwide Assembler*)
* Yasm  (*Yet another assembler*)
* FASM  (*Flat Assembler*)

GNU Assembler
--------------
* Součást klasického toolchainu
  `cpp → gcc → as → ld → spustitelný_soubor`
    - Překlad do asm: `gcc -S source.c`
* Původně jen AT&T syntaxe
* Dnes i „Intel“ syntaxe (na x86/x86-64)
* Různý způsob zápisu podle platformy!
    - Jména registrů
    - Konstanty
    - Adresování
    - Komentáře

NASM
----
* Netwide Assembler
    - Syntaxe inspirována TASM a MASM
* Původní autor *Simon Tatham* (PuTTY...)
* Generuje objektový kód pro platformu x86 (16bit, 32bit, 64bit)
    - Zjednodušený toolchain
        - `nasm` → flat file (.COM, bootloader...)
        - `nasm` → `ln` → spustitelný_soubor

FASM
----
* Flat Assembler
* Autor *Tomasz Grysztar*
* Backend pro PureBasic, BlitzMax a HLA

Assembler v C
-------------
* Podporováno většinou překladačů
   Ovšem není součástí standardu
* Blok nebo „makro“ asm popř. __asm__
   ```C
   asm {
       add RAX, RBX
       nop
   }
   asm("add RAX, RBX \n\t"
       "nop");
   ```

Zápis v GCC
-----------
```C
int main()
{
    __asm__ __volatile__(
        "nop   \n\t"
        : /* zadne vystupni registry */
        : /* zadne vstupni operandy */
        : /* zadne registry pouzivane uvnitr kodu */
    );
    return 0;
}
```

Builtins v GCC
--------------
* Překlad typicky proveden do přímého volání strojových instrukcí
* Nabízené operace překračují sémantické možnosti jazyka C
    - to ovšem neznamená, že C nedokáže vygenerovat podobný kód
    - jen je výsledek buď nečitelný nebo poměrně dlouhý

Součet operandů s detekcí přetečení
-----------------------------------
* Většina architektur má pro podobnou operaci dedikované instrukce
* Přenositelný zápis v C je relativně komplikovaný
* Použití builtins je v tomto případě taktéž přenositelné a kratší

Operace s celými vektory
-----------------------------------
* SIMD instrukce na mnoha moderních architekturách
* &bdquo;vector extension&ldquo; v GCC i dalších překladačích
