add_arrays:
        vmovups ymm0, YMMWORD PTR [rsi]
        vaddps  ymm0, ymm0, YMMWORD PTR [rdi]
        vmovups YMMWORD PTR [rdi], ymm0
        vmovups ymm0, YMMWORD PTR [rdi+32]
        vaddps  ymm0, ymm0, YMMWORD PTR [rsi+32]
        vmovups YMMWORD PTR [rdi+32], ymm0
        vzeroupper
        ret
