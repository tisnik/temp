add_overflow_signed_int:
        cmn     w0, w1
        cset    w0, vs
        ret
