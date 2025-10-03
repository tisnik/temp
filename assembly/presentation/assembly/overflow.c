bool add_overflow_signed_int(signed int x, signed int y) {
    signed int z;
    bool overflow = __builtin_add_overflow(x, y, &z);
    return overflow;
}
