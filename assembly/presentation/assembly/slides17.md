
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
