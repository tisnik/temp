; asmsyntax=nasm

; "Hello world!" v assembleru NASM.
;


; Linux kernel system call table
sys_exit  equ 1
sys_write equ 4



;-----------------------------------------------------------------------------
section .data
        hello:        db 'Hello world!',10



;-----------------------------------------------------------------------------
section .text
        global _start           ; tento symbol ma byt dostupny i linkeru

_start:
        mov   eax, sys_write    ; cislo syscallu pro funkci "write"
        mov   ebx, 1            ; standardni vystup
        mov   ecx, hello        ; adresa retezce, ktery se ma vytisknout
        mov   edx, 13           ; pocet znaku, ktere se maji vytisknout
        int   80h               ; volani Linuxoveho kernelu

        mov   eax, sys_exit     ; cislo sycallu pro funkci "exit"
        mov   ebx, 0            ; exit code = 0
        int   80h               ; volani Linuxoveho kernelu

