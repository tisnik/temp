
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
