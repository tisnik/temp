add_arrays:
        ldp     q24, q26, [x1]
        ldp     q28, q31, [x1, 32]
        ldp     q25, q27, [x0]
        ldp     q29, q30, [x0, 32]
        fadd    v24.4s, v25.4s, v24.4s
        fadd    v26.4s, v27.4s, v26.4s
        fadd    v28.4s, v29.4s, v28.4s
        fadd    v30.4s, v31.4s, v30.4s
        stp     q24, q26, [x0]
        stp     q28, q30, [x0, 32]
        ret
