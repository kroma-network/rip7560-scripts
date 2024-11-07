// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.23;

struct Poly {
    int32[256] coeffs;
}

struct PolyVecK {
    Poly[4] polys;
}

struct PolyVecL {
    Poly[4] polys;
}

struct ExpandedPublicKey {
    bytes32 packed;
    PolyVecL[4] mat;
    PolyVecK t1;
}

interface IDilithiumPublicKey {
    function expandedPublicKey()
        external
        view
        returns (ExpandedPublicKey memory);
}

// prettier-ignore
contract PKMAT0 {
    constructor() {}
    function mat0() external pure returns (PolyVecL memory m) {
        m.polys[0].coeffs = [{%%mat0.polys0%%}];
        m.polys[1].coeffs = [{%%mat0.polys1%%}];
        m.polys[2].coeffs = [{%%mat0.polys2%%}];
        m.polys[3].coeffs = [{%%mat0.polys3%%}];
    }
}

// prettier-ignore
contract PKMAT1 {
    constructor() {}
    function mat1() external pure returns (PolyVecL memory m) {
        m.polys[0].coeffs = [{%%mat1.polys0%%}];
        m.polys[1].coeffs = [{%%mat1.polys1%%}];
        m.polys[2].coeffs = [{%%mat1.polys2%%}];
        m.polys[3].coeffs = [{%%mat1.polys3%%}];
    }
}

// prettier-ignore
contract PKMAT2 {
    constructor() {}
    function mat2() external pure returns (PolyVecL memory m) {
        m.polys[0].coeffs = [{%%mat2.polys0%%}];
        m.polys[1].coeffs = [{%%mat2.polys1%%}];
        m.polys[2].coeffs = [{%%mat2.polys2%%}];
        m.polys[3].coeffs = [{%%mat2.polys3%%}];
    }
}

// prettier-ignore
contract PKMAT3 {
    constructor() {}
    function mat3() external pure returns (PolyVecL memory m) {
        m.polys[0].coeffs = [{%%mat3.polys0%%}];
        m.polys[1].coeffs = [{%%mat3.polys1%%}];
        m.polys[2].coeffs = [{%%mat3.polys2%%}];
        m.polys[3].coeffs = [{%%mat3.polys3%%}];
    }
}

// prettier-ignore
contract PKT1 {
    constructor() {}
    function t1() external pure returns (PolyVecK memory m) {
        m.polys[0].coeffs = [{%%t1.polys0%%}];
        m.polys[1].coeffs = [{%%t1.polys1%%}];
        m.polys[2].coeffs = [{%%t1.polys2%%}];
        m.polys[3].coeffs = [{%%t1.polys3%%}];
    }
}

contract DilithiumPublicKey is IDilithiumPublicKey {
    PKMAT0 immutable mat0;
    PKMAT1 immutable mat1;
    PKMAT2 immutable mat2;
    PKMAT3 immutable mat3;
    PKT1 immutable t1;

    constructor(
        PKMAT0 _mat0,
        PKMAT1 _mat1,
        PKMAT2 _mat2,
        PKMAT3 _mat3,
        PKT1 _t1
    ) {
        mat0 = _mat0;
        mat1 = _mat1;
        mat2 = _mat2;
        mat3 = _mat3;
        t1 = _t1;
    }

    function expandedPublicKey()
        external
        view
        override
        returns (ExpandedPublicKey memory epk)
    {
        epk
            .packed = hex"{%%packed%%}";
        epk.t1 = t1.t1();
        epk.mat[0] = mat0.mat0();
        epk.mat[1] = mat1.mat1();
        epk.mat[2] = mat2.mat2();
        epk.mat[3] = mat3.mat3();
    }
}
