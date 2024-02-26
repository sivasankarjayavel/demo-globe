/* This file is mostly a straight translation of
 * GeographicLib/src/Geoid.cpp from C++ to JavaScript
 * by Kim Vandry <vandry@TZoNE.ORG>
 *
 * @license
 *  **
 * * \file Geoid.cpp
 * * \brief Implementation for GeographicLib::Geoid class
 * *
 * * Copyright (c) Charles Karney (2009) <charles@karney.com>
 * * and licensed under the LGPL.  For more information, see
 * * http://geographiclib.sourceforge.net/
 * **********************************************************************
 *
 * Geoid height grade not supported
 * The files can be downloaded from here:
 * http://geographiclib.sourceforge.net/1.18/geoid.html
 */
class Geoid {
    constructor(options = {}) {
        this.model = options.model || null;
        this.src = options.src || null;
        this._cached_ix = 0;
        this._cached_iy = 0;
        this._v00 = 0;
        this._v01 = 0;
        this._v10 = 0;
        this._v11 = 0;
        this._t = 0;
    }
    static loadModel(url) {
        if (!url) {
            return new Promise((resolve) => {
                resolve(null);
            });
        }
        else
            return fetch(url, {})
                .then((r) => {
                if (!r.ok) {
                    throw Error("Geoid model file: HTTP error " + r.status);
                }
                return r.arrayBuffer();
            })
                .then((r) => {
                if (r) {
                    return new Uint8Array(r);
                }
                else {
                    throw Error("Geoid model file: no data from " + url);
                }
            })
                .then(function (rawfile) {
                if (!((rawfile[0] === 80) && (rawfile[1] === 53) && (((rawfile[2] === 13) && (rawfile[3] === 10)) ||
                    (rawfile[2] === 10)))) {
                    throw new Error("Geoid model file: no PGM header");
                }
                var i = (rawfile[2] === 13) ? 4 : 3;
                var offset = null;
                var scale = null;
                function getline() {
                    let start = i;
                    for (var j = i;; j++) {
                        if (j >= rawfile.length) {
                            throw new Error("Geoid model file: missing newline in header");
                        }
                        if (rawfile[j] === 10) {
                            i = j + 1;
                            break;
                        }
                    }
                    if ((j > start) && (rawfile[j - 1] === 13))
                        j--;
                    return String.fromCharCode.apply(null, rawfile.slice(start, j));
                }
                var m, s;
                for (;;) {
                    s = getline();
                    if (s[0] !== '#')
                        break;
                    m = s.match(/^# Offset (.*)$/);
                    if (m) {
                        offset = parseInt(m[1], 10);
                        if (!isFinite(offset)) {
                            throw new Error("Geoid model file: bad offset " + m[1]);
                        }
                    }
                    else {
                        m = s.match(/^# Scale (.*)$/);
                        if (m) {
                            scale = parseFloat(m[1]);
                            if (!isFinite(scale)) {
                                throw new Error("Geoid model file: bad scale " + m[1]);
                            }
                        }
                    }
                }
                m = s.match(/^\s*(\d+)\s+(\d+)\s*$/);
                let width = 0;
                let height = 0;
                if (m) {
                    width = parseInt(m[1], 10);
                    height = parseInt(m[2], 10);
                }
                if (!(m && (width >= 0) && (height >= 0))) {
                    throw new Error("Geoid model file: bad PGM width&height line");
                }
                let levels = parseInt(getline());
                if (levels != 65535) {
                    throw new Error("Geoid model file: PGM file must have 65535 gray levels");
                }
                if (offset === null) {
                    throw new Error("Geoid model file: PGM file does not contain offset");
                }
                if (scale === null) {
                    throw new Error("Geoid model file: PGM file does not contain scale");
                }
                if ((width < 2) || (height < 2)) {
                    throw new Error("Geoid model file: Raster size too small");
                }
                let payload_len = rawfile.length - i;
                if (payload_len !== (width * height * 2)) {
                    throw new Error("Geoid model file: File has the wrong length");
                }
                return {
                    scale: scale,
                    offset: offset,
                    width: width,
                    height: height,
                    rlonres: width / 360,
                    rlatres: (height - 1) / 180,
                    i: i,
                    rawfile: rawfile
                };
            });
    }
    setModel(model) {
        this.model = model;
    }
    _rawval(ix, iy) {
        let model = this.model;
        if (iy < 0) {
            iy = -iy;
            ix += model.width / 2;
        }
        else if (iy >= model.height) {
            iy = 2 * (model.height - 1) - iy;
            ix += model.width / 2;
        }
        if (ix < 0) {
            ix += model.width;
        }
        else if (ix >= model.width) {
            ix -= model.width;
        }
        let k = (iy * model.width + ix) * 2 + model.i;
        return (model.rawfile[k] << 8) | model.rawfile[k + 1];
    }
    getHeightLonLat(lonlat) {
        return this.getHeight(lonlat.lon, lonlat.lat);
    }
    getHeight(lon, lat) {
        if (!this.model)
            return 0;
        let model = this.model;
        if (lon < 0)
            lon += 360.0;
        let fy = (90 - lat) * model.rlatres;
        let fx = lon * model.rlonres;
        let iy = Math.floor(fy);
        let ix = Math.floor(fx);
        fx -= ix;
        fy -= iy;
        if (iy === (model.height - 1)) {
            iy--;
        }
        if ((this._cached_ix !== ix) || (this._cached_iy !== iy)) {
            this._cached_ix = ix;
            this._cached_iy = iy;
            this._v00 = this._rawval(ix, iy);
            this._v01 = this._rawval(ix + 1, iy);
            this._v10 = this._rawval(ix, iy + 1);
            this._v11 = this._rawval(ix + 1, iy + 1);
        }
        let a = (1 - fx) * this._v00 + fx * this._v01;
        let b = (1 - fx) * this._v10 + fx * this._v11;
        let h = (1 - fy) * a + fy * b;
        return model.offset + model.scale * h;
    }
}
export { Geoid };
