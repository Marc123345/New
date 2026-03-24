const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/GlobeWrapper-DPsWe_bE.js","assets/vendor-rapier-BlGIw0Ig.js","assets/vendor-three-C9nf-1Xb.js","assets/vendor-react-Bkc4rGZb.js","assets/vendor-motion-DmjuJuG3.js","assets/AboutStory-C_ZjFOdS.js","assets/EcosystemServices-C-YjD_p_.js","assets/megaphone-CPElopvX.js","assets/ArcSlider-hRSab-q2.js","assets/Testimonials-D2GrObWj.js","assets/BlogSection-BJl7Tanz.js"])))=>i.map(i=>d[i]);
import { j as e, A as ne, m as x, u as he, a as ae, b as qe } from "./vendor-motion-DmjuJuG3.js";
import { dQ as $e, aw as Ye, X as Ve, aJ as Ue, f as le, W as Xe, dd as Q, d as ee, M as Y, aW as Ke, dT as Ze, z as Ne, dU as Je, C as Qe, ao as et, dR as tt, dV as z, dW as Pe, dX as at, dY as rt, dZ as ot, d_ as nt, d$ as it, e0 as re, am as ge, h as Be, Y as st, e1 as lt, e2 as ct } from "./vendor-three-C9nf-1Xb.js";
import { _ as J, P as dt, b as He, B as pt, C as ce } from "./vendor-rapier-BlGIw0Ig.js";
import { a as s, u as ut, c as mt, R as We, L as Me, d as ht, B as gt, e as xt, f as te, __tla as __tla_0 } from "./vendor-react-Bkc4rGZb.js";
let _a, qa, be, De, _, aa, we;
let __tla = Promise.all([
    (()=>{
        try {
            return __tla_0;
        } catch  {}
    })()
]).then(async ()=>{
    (function() {
        const r = document.createElement("link").relList;
        if (r && r.supports && r.supports("modulepreload")) return;
        for (const o of document.querySelectorAll('link[rel="modulepreload"]'))a(o);
        new MutationObserver((o)=>{
            for (const n of o)if (n.type === "childList") for (const m of n.addedNodes)m.tagName === "LINK" && m.rel === "modulepreload" && a(m);
        }).observe(document, {
            childList: !0,
            subtree: !0
        });
        function i(o) {
            const n = {};
            return o.integrity && (n.integrity = o.integrity), o.referrerPolicy && (n.referrerPolicy = o.referrerPolicy), o.crossOrigin === "use-credentials" ? n.credentials = "include" : o.crossOrigin === "anonymous" ? n.credentials = "omit" : n.credentials = "same-origin", n;
        }
        function a(o) {
            if (o.ep) return;
            o.ep = !0;
            const n = i(o);
            fetch(o.href, n);
        }
    })();
    const ft = "https://ik.imagekit.io/qcvroy8xpd/h2h%20logo%20WHITE%20.png", yt = "https://ik.imagekit.io/qcvroy8xpd/h2h%20logo%20black%20text.png";
    function xe({ height: t = 60, className: r, style: i, onDark: a = !0 }) {
        return e.jsx("img", {
            src: a ? ft : yt,
            alt: "H2H Social Logo",
            className: r,
            style: {
                height: t,
                width: "auto",
                flexShrink: 0,
                objectFit: "contain",
                ...i
            }
        });
    }
    function vt({ onComplete: t }) {
        const [r, i] = s.useState(0), [a, o] = s.useState("loading"), n = s.useRef(0), m = s.useRef(0), l = s.useRef(null), v = 2600;
        s.useEffect(()=>{
            const p = l.current;
            if (!p) return;
            const y = p.getContext("2d");
            if (!y) return;
            let u = p.width = window.innerWidth, h = p.height = window.innerHeight, w = 0;
            const g = ()=>{
                y.clearRect(0, 0, u, h), y.fillStyle = "rgba(164,108,252,0.06)";
                const k = 40;
                for(let f = 0; f < u; f += k)for(let I = 0; I < h; I += k)y.beginPath(), y.arc(f, I, 1, 0, Math.PI * 2), y.fill();
                w = requestAnimationFrame(g);
            };
            g();
            const S = ()=>{
                u = p.width = window.innerWidth, h = p.height = window.innerHeight;
            };
            return window.addEventListener("resize", S, {
                passive: !0
            }), ()=>{
                cancelAnimationFrame(w), window.removeEventListener("resize", S);
            };
        }, []), s.useEffect(()=>{
            const p = (y)=>{
                m.current || (m.current = y);
                const u = y - m.current, h = Math.min(u / v, 1), w = 1 - Math.pow(1 - h, 3), g = Math.floor(w * 100);
                i(g), h < 1 ? n.current = requestAnimationFrame(p) : (i(100), o("done"), setTimeout(()=>o("exit"), 600), setTimeout(t, 1300));
            };
            return n.current = requestAnimationFrame(p), ()=>cancelAnimationFrame(n.current);
        }, [
            t
        ]);
        const b = a === "exit";
        return e.jsxs("div", {
            style: {
                position: "fixed",
                inset: 0,
                zIndex: 99999,
                background: "#0e0b1f",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                transition: b ? "opacity 0.7s ease, transform 0.7s cubic-bezier(0.76,0,0.24,1)" : "none",
                opacity: b ? 0 : 1,
                transform: b ? "translateY(-40px)" : "translateY(0)",
                pointerEvents: b ? "none" : "all"
            },
            children: [
                e.jsx("canvas", {
                    ref: l,
                    style: {
                        position: "absolute",
                        inset: 0,
                        pointerEvents: "none"
                    }
                }),
                e.jsx("div", {
                    style: {
                        position: "absolute",
                        top: 32,
                        left: 32
                    },
                    children: e.jsx("div", {
                        style: {
                            width: 24,
                            height: 24,
                            borderTop: "2px solid rgba(164,108,252,0.4)",
                            borderLeft: "2px solid rgba(164,108,252,0.4)"
                        }
                    })
                }),
                e.jsx("div", {
                    style: {
                        position: "absolute",
                        top: 32,
                        right: 32
                    },
                    children: e.jsx("div", {
                        style: {
                            width: 24,
                            height: 24,
                            borderTop: "2px solid rgba(164,108,252,0.4)",
                            borderRight: "2px solid rgba(164,108,252,0.4)"
                        }
                    })
                }),
                e.jsx("div", {
                    style: {
                        position: "absolute",
                        bottom: 32,
                        left: 32
                    },
                    children: e.jsx("div", {
                        style: {
                            width: 24,
                            height: 24,
                            borderBottom: "2px solid rgba(164,108,252,0.4)",
                            borderLeft: "2px solid rgba(164,108,252,0.4)"
                        }
                    })
                }),
                e.jsx("div", {
                    style: {
                        position: "absolute",
                        bottom: 32,
                        right: 32
                    },
                    children: e.jsx("div", {
                        style: {
                            width: 24,
                            height: 24,
                            borderBottom: "2px solid rgba(164,108,252,0.4)",
                            borderRight: "2px solid rgba(164,108,252,0.4)"
                        }
                    })
                }),
                e.jsx("div", {
                    style: {
                        position: "absolute",
                        left: 0,
                        right: 0,
                        height: 1,
                        background: "linear-gradient(90deg, transparent 0%, rgba(164,108,252,0.15) 20%, rgba(164,108,252,0.4) 50%, rgba(164,108,252,0.15) 80%, transparent 100%)",
                        top: `${r}%`,
                        transition: "top 0.05s linear"
                    }
                }),
                e.jsxs("div", {
                    style: {
                        position: "relative",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: 48
                    },
                    children: [
                        e.jsx("div", {
                            style: {
                                animation: "loaderLogoPulse 3s ease-in-out infinite",
                                filter: `drop-shadow(0 0 ${12 + r * .18}px rgba(164,108,252,${.3 + r * .004}))`
                            },
                            children: e.jsx(xe, {
                                height: 72
                            })
                        }),
                        e.jsxs("div", {
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                gap: 20,
                                width: 320
                            },
                            children: [
                                e.jsxs("div", {
                                    style: {
                                        display: "flex",
                                        alignItems: "baseline",
                                        gap: 4
                                    },
                                    children: [
                                        e.jsx("span", {
                                            style: {
                                                fontFamily: "var(--font-stack-heading)",
                                                fontSize: "clamp(4rem, 10vw, 7rem)",
                                                fontWeight: 900,
                                                lineHeight: 1,
                                                color: "#e8e2ff",
                                                letterSpacing: "-0.04em",
                                                fontVariantNumeric: "tabular-nums",
                                                textShadow: "0 0 40px rgba(164,108,252,0.5)"
                                            },
                                            children: String(r).padStart(2, "0")
                                        }),
                                        e.jsx("span", {
                                            style: {
                                                fontFamily: "var(--font-stack-heading)",
                                                fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                                                fontWeight: 700,
                                                color: "var(--color-secondary)",
                                                lineHeight: 1,
                                                marginBottom: 8
                                            },
                                            children: "%"
                                        })
                                    ]
                                }),
                                e.jsxs("div", {
                                    style: {
                                        position: "relative",
                                        width: "100%"
                                    },
                                    children: [
                                        e.jsxs("div", {
                                            style: {
                                                width: "100%",
                                                height: 2,
                                                background: "rgba(164,108,252,0.12)",
                                                position: "relative",
                                                overflow: "visible"
                                            },
                                            children: [
                                                e.jsx("div", {
                                                    style: {
                                                        position: "absolute",
                                                        left: 0,
                                                        top: 0,
                                                        height: "100%",
                                                        width: `${r}%`,
                                                        background: "linear-gradient(90deg, #291e56, #a46cfc)",
                                                        transition: "width 0.05s linear"
                                                    }
                                                }),
                                                e.jsx("div", {
                                                    style: {
                                                        position: "absolute",
                                                        top: "50%",
                                                        left: `${r}%`,
                                                        transform: "translate(-50%, -50%)",
                                                        width: 8,
                                                        height: 8,
                                                        borderRadius: "50%",
                                                        background: "#a46cfc",
                                                        boxShadow: "0 0 12px 4px rgba(164,108,252,0.8)",
                                                        transition: "left 0.05s linear"
                                                    }
                                                })
                                            ]
                                        }),
                                        e.jsx("div", {
                                            style: {
                                                display: "flex",
                                                justifyContent: "space-between",
                                                marginTop: 10
                                            },
                                            children: [
                                                0,
                                                25,
                                                50,
                                                75,
                                                100
                                            ].map((p)=>e.jsxs("div", {
                                                    style: {
                                                        display: "flex",
                                                        flexDirection: "column",
                                                        alignItems: "center",
                                                        gap: 4
                                                    },
                                                    children: [
                                                        e.jsx("div", {
                                                            style: {
                                                                width: 1,
                                                                height: 4,
                                                                background: r >= p ? "rgba(164,108,252,0.7)" : "rgba(164,108,252,0.2)",
                                                                transition: "background 0.3s"
                                                            }
                                                        }),
                                                        e.jsx("span", {
                                                            style: {
                                                                fontFamily: "var(--font-stack-heading)",
                                                                fontSize: "0.5rem",
                                                                letterSpacing: "0.1em",
                                                                color: r >= p ? "rgba(164,108,252,0.7)" : "rgba(164,108,252,0.2)",
                                                                transition: "color 0.3s"
                                                            },
                                                            children: p
                                                        })
                                                    ]
                                                }, p))
                                        })
                                    ]
                                }),
                                e.jsx("div", {
                                    style: {
                                        height: 20,
                                        display: "flex",
                                        alignItems: "center"
                                    },
                                    children: e.jsx("span", {
                                        style: {
                                            fontFamily: "var(--font-stack-heading)",
                                            fontSize: "0.55rem",
                                            letterSpacing: "0.35em",
                                            textTransform: "uppercase",
                                            color: a === "done" ? "var(--color-secondary)" : "rgba(232,226,255,0.35)",
                                            transition: "color 0.4s ease"
                                        },
                                        children: a === "done" ? "— Ready —" : "Initialising Experience"
                                    })
                                })
                            ]
                        })
                    ]
                }),
                e.jsxs("div", {
                    style: {
                        position: "absolute",
                        bottom: 40,
                        left: "50%",
                        transform: "translateX(-50%)",
                        display: "flex",
                        alignItems: "center",
                        gap: 12
                    },
                    children: [
                        e.jsx("div", {
                            style: {
                                width: 32,
                                height: 1,
                                background: "rgba(164,108,252,0.3)"
                            }
                        }),
                        e.jsx("span", {
                            style: {
                                fontFamily: "var(--font-stack-heading)",
                                fontSize: "0.5rem",
                                letterSpacing: "0.4em",
                                textTransform: "uppercase",
                                color: "rgba(232,226,255,0.25)",
                                whiteSpace: "nowrap"
                            },
                            children: "Human To Human Social"
                        }),
                        e.jsx("div", {
                            style: {
                                width: 32,
                                height: 1,
                                background: "rgba(164,108,252,0.3)"
                            }
                        })
                    ]
                }),
                e.jsx("style", {
                    children: `
        @keyframes loaderLogoPulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.04); }
        }
      `
                })
            ]
        });
    }
    function bt(t) {
        return {
            onMouseEnter: (r)=>{
                r.currentTarget.style.boxShadow = "var(--shadow-button-hover)", r.currentTarget.style.transform = "translate(-2px, -2px)";
            },
            onMouseLeave: (r)=>{
                r.currentTarget.style.boxShadow = "var(--shadow-button)", r.currentTarget.style.transform = "translate(0, 0)";
            }
        };
    }
    class wt extends s.Component {
        constructor(r){
            super(r), this.state = {
                hasError: !1
            };
        }
        static getDerivedStateFromError(r) {
            return {
                hasError: !0,
                error: r
            };
        }
        componentDidCatch(r, i) {
            console.error("Error caught by boundary:", r, i);
        }
        render() {
            return this.state.hasError ? this.props.fallback ? this.props.fallback : e.jsx("div", {
                className: "min-h-screen flex items-center justify-center bg-[var(--color-background-light)] px-6",
                children: e.jsxs("div", {
                    className: "text-center max-w-md",
                    children: [
                        e.jsx("h2", {
                            className: "text-4xl mb-4 text-[var(--color-primary)]",
                            style: {
                                fontFamily: "var(--font-stack-heading)"
                            },
                            children: "OOPS!"
                        }),
                        e.jsx("p", {
                            className: "text-lg text-[var(--color-text-dark)]/70 mb-8",
                            children: "Something went wrong. Please refresh the page or contact support if the problem persists."
                        }),
                        e.jsx("button", {
                            onClick: ()=>window.location.reload(),
                            className: "inline-block px-8 py-4 border-2 cursor-pointer transition-all duration-200 uppercase bg-[var(--color-primary)] text-white border-[var(--color-text-dark)]",
                            style: {
                                fontFamily: "var(--font-stack-heading)",
                                boxShadow: "var(--shadow-button)"
                            },
                            ...bt(),
                            children: "Reload Page"
                        })
                    ]
                })
            }) : this.props.children;
        }
    }
    function kt(t = {}) {
        const { threshold: r = .1, rootMargin: i = "100px", triggerOnce: a = !0 } = t, o = s.useRef(null), [n, m] = s.useState(!1);
        return s.useEffect(()=>{
            const l = o.current;
            if (!l) return;
            const v = new IntersectionObserver(([b])=>{
                const p = b.isIntersecting;
                m(p), p && a && v.disconnect();
            }, {
                threshold: r,
                rootMargin: i
            });
            return v.observe(l), ()=>{
                v.disconnect();
            };
        }, [
            r,
            i,
            a
        ]), [
            o,
            n
        ];
    }
    function ue() {
        return e.jsx("div", {
            className: "w-full h-96 flex items-center justify-center",
            children: e.jsxs("div", {
                className: "relative",
                children: [
                    e.jsx("div", {
                        className: "w-12 h-12 border-4 border-[var(--color-primary)]/20 border-t-[var(--color-primary)] rounded-full animate-spin"
                    }),
                    e.jsx("div", {
                        className: "absolute inset-0 w-12 h-12 border-4 border-transparent border-r-[var(--color-secondary)]/40 rounded-full animate-spin",
                        style: {
                            animationDirection: "reverse",
                            animationDuration: "1.5s"
                        }
                    })
                ]
            })
        });
    }
    function _e({ children: t, fallback: r = e.jsx(ue, {}), threshold: i = .1, rootMargin: a = "200px" }) {
        const [o, n] = kt({
            threshold: i,
            rootMargin: a,
            triggerOnce: !0
        });
        return e.jsx("div", {
            ref: o,
            style: {
                minHeight: "1px",
                contentVisibility: "auto",
                containIntrinsicSize: "0 500px"
            },
            children: n ? e.jsx(s.Suspense, {
                fallback: r,
                children: t
            }) : r
        });
    }
    function jt() {
        const t = s.useRef(null), r = s.useRef(0), i = s.useRef(!1);
        return s.useEffect(()=>{
            const a = ()=>{
                const n = document.documentElement.scrollHeight - window.innerHeight;
                n > 0 && t.current && (t.current.style.width = `${window.scrollY / n * 100}%`), i.current = !1;
            }, o = ()=>{
                i.current || (i.current = !0, r.current = requestAnimationFrame(a));
            };
            return window.addEventListener("scroll", o, {
                passive: !0
            }), a(), ()=>{
                window.removeEventListener("scroll", o), cancelAnimationFrame(r.current);
            };
        }, []), e.jsx("div", {
            className: "fixed top-0 left-0 right-0 z-50 h-1 bg-[var(--color-primary)]/10",
            children: e.jsx("div", {
                ref: t,
                className: "h-full bg-[var(--color-secondary)]",
                style: {
                    width: "0%",
                    willChange: "width"
                }
            })
        });
    }
    const St = [
        {
            label: "Home",
            href: "#hero",
            id: "01",
            sub: "Start here"
        },
        {
            label: "About",
            href: "#about",
            id: "02",
            sub: "Our story"
        },
        {
            label: "Three Pillars",
            href: "#ecosystem",
            id: "03",
            sub: "Core framework"
        },
        {
            label: "Services",
            href: "#services",
            id: "04",
            sub: "What we offer"
        },
        {
            label: "Testimonials",
            href: "#testimonials",
            id: "05",
            sub: "Client voices"
        },
        {
            label: "Blog",
            href: "/blog",
            id: "06",
            sub: "Insights & ideas"
        }
    ], Ce = [
        {
            label: "LinkedIn",
            href: "https://www.linkedin.com/company/human2humanmarketing/"
        },
        {
            label: "Twitter",
            href: "#"
        },
        {
            label: "Instagram",
            href: "#"
        }
    ];
    function ie() {
        const [t, r] = s.useState(!1), [i, a] = s.useState(null), [o, n] = s.useState(!1), [m, l] = s.useState(!1), [v, b] = s.useState(!1), p = ut(), y = mt(), u = s.useRef(null), h = s.useRef(null), w = s.useRef(!1), g = y.pathname === "/";
        s.useEffect(()=>{
            let c = 0;
            const d = ()=>{
                c || (c = requestAnimationFrame(()=>{
                    c = 0, l(window.scrollY > 40), b(window.scrollY > window.innerHeight * .85);
                }));
            };
            return window.addEventListener("scroll", d, {
                passive: !0
            }), ()=>{
                window.removeEventListener("scroll", d), cancelAnimationFrame(c);
            };
        }, []), s.useEffect(()=>{
            if (!t) return;
            const c = (d)=>{
                d.key === "Escape" && r(!1);
            };
            return document.addEventListener("keydown", c), ()=>document.removeEventListener("keydown", c);
        }, [
            t
        ]);
        const S = s.useRef(0);
        s.useEffect(()=>(t ? (w.current = !1, S.current = window.scrollY, document.body.style.overflow = "hidden", u.current = setTimeout(()=>n(!0), 50)) : (n(!1), document.body.style.overflow = "", w.current || window.scrollTo(0, S.current), w.current = !1), ()=>{
                document.body.style.overflow = "", u.current && clearTimeout(u.current);
            }), [
            t
        ]);
        const k = s.useCallback((c, d)=>{
            if (c.preventDefault(), w.current = !0, r(!1), h.current && clearTimeout(h.current), d.startsWith("/")) {
                h.current = setTimeout(()=>p(d), 400);
                return;
            }
            if (!g) {
                h.current = setTimeout(()=>{
                    p("/"), setTimeout(()=>{
                        const M = document.getElementById(d.substring(1));
                        M && window.scrollTo({
                            top: M.offsetTop - 120,
                            behavior: "smooth"
                        });
                    }, 300);
                }, 400);
                return;
            }
            h.current = setTimeout(()=>{
                const M = document.getElementById(d.substring(1));
                M && window.scrollTo({
                    top: M.offsetTop - 120,
                    behavior: "smooth"
                });
            }, 450);
        }, [
            p,
            g
        ]), f = s.useCallback((c)=>{
            c.preventDefault(), g ? window.scrollTo({
                top: 0,
                behavior: "smooth"
            }) : p("/");
        }, [
            p,
            g
        ]), I = g ? v : !0, L = I ? "rgba(232,226,255,0.9)" : "rgba(10,10,10,0.85)", j = I ? "rgba(232,226,255,0.45)" : "rgba(10,10,10,0.45)";
        return e.jsxs(e.Fragment, {
            children: [
                !g && e.jsx("div", {
                    className: "h-20 md:h-24 w-full"
                }),
                e.jsx("header", {
                    className: "fixed top-0 left-0 w-full z-[100] transition-all duration-500",
                    style: {
                        padding: "clamp(16px, 2.5vh, 28px) clamp(20px, 4vw, 56px)",
                        backgroundColor: m ? I ? "rgba(14,11,31,0.85)" : "rgba(255,255,255,0.88)" : "transparent",
                        backdropFilter: m ? "blur(14px)" : "none",
                        borderBottom: m ? I ? "1px solid rgba(164,108,252,0.12)" : "1px solid rgba(0,0,0,0.07)" : "1px solid transparent"
                    },
                    children: e.jsxs("div", {
                        className: "flex items-center justify-between",
                        children: [
                            e.jsx("a", {
                                href: "/",
                                "aria-label": "H2H Social Home",
                                onClick: f,
                                className: `relative z-[110] transition-all duration-300 ${t ? "opacity-0 pointer-events-none" : "opacity-100"}`,
                                children: e.jsx(xe, {
                                    height: 64,
                                    className: "transition-all duration-500",
                                    onDark: I
                                })
                            }),
                            e.jsxs("div", {
                                className: `flex items-center gap-3 sm:gap-4 transition-all duration-300 ${t ? "opacity-0 pointer-events-none" : "opacity-100"}`,
                                children: [
                                    e.jsx("a", {
                                        href: "#contact",
                                        onClick: (c)=>k(c, "#contact"),
                                        className: "hidden sm:inline-flex items-center",
                                        style: {
                                            fontFamily: "var(--font-stack-heading)",
                                            fontSize: "0.65rem",
                                            fontWeight: 500,
                                            letterSpacing: "0.14em",
                                            textTransform: "uppercase",
                                            color: "#fff",
                                            background: "#0a0a0a",
                                            borderRadius: 999,
                                            padding: "10px 22px",
                                            whiteSpace: "nowrap",
                                            transition: "background 0.2s ease, transform 0.2s ease",
                                            cursor: "pointer"
                                        },
                                        onMouseEnter: (c)=>{
                                            c.currentTarget.style.background = "var(--color-secondary)", c.currentTarget.style.transform = "translateY(-1px)";
                                        },
                                        onMouseLeave: (c)=>{
                                            c.currentTarget.style.background = "#0a0a0a", c.currentTarget.style.transform = "translateY(0)";
                                        },
                                        children: "Let's Talk"
                                    }),
                                    e.jsxs("button", {
                                        onClick: ()=>r(!0),
                                        "aria-label": "Open navigation",
                                        "aria-expanded": t,
                                        className: "group flex items-center gap-2.5",
                                        style: {
                                            minWidth: 44,
                                            minHeight: 44,
                                            touchAction: "manipulation"
                                        },
                                        children: [
                                            e.jsx("span", {
                                                className: "hidden sm:block text-[10px] uppercase tracking-[0.28em] font-medium transition-colors duration-400",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    color: j
                                                },
                                                children: "Menu"
                                            }),
                                            e.jsxs("div", {
                                                className: "flex flex-col gap-[5px] w-5",
                                                children: [
                                                    e.jsx("span", {
                                                        className: "block h-[1.5px] w-full transition-colors duration-400",
                                                        style: {
                                                            backgroundColor: L
                                                        }
                                                    }),
                                                    e.jsx("span", {
                                                        className: "block h-[1.5px] w-3/4 transition-colors duration-400",
                                                        style: {
                                                            backgroundColor: L
                                                        }
                                                    }),
                                                    e.jsx("span", {
                                                        className: "block h-[1.5px] w-1/2 transition-colors duration-400",
                                                        style: {
                                                            backgroundColor: L
                                                        }
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                }),
                e.jsxs("div", {
                    className: `fixed inset-0 z-[110] transition-opacity duration-700 ${t ? "opacity-100" : "opacity-0 pointer-events-none"}`,
                    style: {
                        backgroundColor: "var(--color-background-light, #0e0b1f)"
                    },
                    children: [
                        e.jsx("div", {
                            className: "absolute pointer-events-none",
                            style: {
                                top: "-20%",
                                right: "-10%",
                                width: "60vw",
                                height: "60vw",
                                background: "radial-gradient(circle, rgba(164,108,252,0.06) 0%, transparent 70%)",
                                borderRadius: "50%"
                            }
                        }),
                        e.jsx("div", {
                            className: "absolute pointer-events-none",
                            style: {
                                bottom: "-15%",
                                left: "-10%",
                                width: "50vw",
                                height: "50vw",
                                background: "radial-gradient(circle, rgba(164,108,252,0.04) 0%, transparent 70%)",
                                borderRadius: "50%"
                            }
                        }),
                        e.jsxs("div", {
                            className: "absolute inset-0 flex flex-col lg:flex-row",
                            children: [
                                e.jsx("div", {
                                    className: "flex-1 lg:w-[60%] flex flex-col justify-center px-6 sm:px-8 md:px-16 lg:px-24 pt-14 sm:pt-16 lg:pt-0 overflow-y-auto",
                                    children: e.jsx("nav", {
                                        className: "flex flex-col",
                                        onMouseLeave: ()=>a(null),
                                        children: St.map((c, d)=>e.jsxs("a", {
                                                href: c.href,
                                                onClick: (M)=>k(M, c.href),
                                                onMouseEnter: ()=>a(d),
                                                className: "group relative flex items-center py-2.5 sm:py-3 md:py-4 overflow-hidden",
                                                style: {
                                                    borderBottom: "1px solid rgba(164,108,252,0.08)",
                                                    transition: "all 0.6s cubic-bezier(0.76,0,0.24,1)",
                                                    transitionDelay: o ? `${d * 60}ms` : "0ms",
                                                    transform: o ? "translateY(0)" : "translateY(40px)",
                                                    opacity: o ? 1 : 0
                                                },
                                                children: [
                                                    e.jsx("div", {
                                                        className: "absolute inset-0 transition-transform duration-500 origin-left",
                                                        style: {
                                                            background: "linear-gradient(90deg, rgba(164,108,252,0.06) 0%, transparent 100%)",
                                                            transform: i === d ? "scaleX(1)" : "scaleX(0)"
                                                        }
                                                    }),
                                                    e.jsx("span", {
                                                        className: "relative z-10 w-10 text-xs mr-6 transition-colors duration-300",
                                                        style: {
                                                            fontFamily: "var(--font-stack-heading)",
                                                            color: i === d ? "var(--color-secondary)" : "rgba(232,226,255,0.25)"
                                                        },
                                                        children: c.id
                                                    }),
                                                    e.jsx("span", {
                                                        className: "relative z-10 flex-1 text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tighter uppercase",
                                                        style: {
                                                            fontFamily: "var(--font-stack-heading)",
                                                            color: i !== null && i !== d ? "rgba(232,226,255,0.12)" : "var(--color-text-dark, #e8e2ff)",
                                                            transition: "color 0.4s ease"
                                                        },
                                                        children: c.label
                                                    }),
                                                    e.jsx("span", {
                                                        className: "relative z-10 hidden md:block text-xs tracking-widest uppercase transition-all duration-300",
                                                        style: {
                                                            fontFamily: "var(--font-stack-heading)",
                                                            color: i === d ? "var(--color-secondary)" : "rgba(232,226,255,0.3)",
                                                            transform: i === d ? "translateX(4px)" : "translateX(0)"
                                                        },
                                                        children: c.sub
                                                    }),
                                                    e.jsx("svg", {
                                                        className: "relative z-10 ml-4 w-5 h-5 transition-all duration-300",
                                                        style: {
                                                            color: i === d ? "var(--color-secondary)" : "rgba(232,226,255,0.15)",
                                                            transform: i === d ? "translateX(4px)" : "translateX(0)"
                                                        },
                                                        viewBox: "0 0 24 24",
                                                        fill: "none",
                                                        stroke: "currentColor",
                                                        strokeWidth: 1.5,
                                                        children: e.jsx("path", {
                                                            strokeLinecap: "round",
                                                            strokeLinejoin: "round",
                                                            d: "M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3"
                                                        })
                                                    })
                                                ]
                                            }, c.label))
                                    })
                                }),
                                e.jsxs("div", {
                                    className: "hidden lg:flex lg:w-[40%] flex-col justify-between py-24 px-16",
                                    style: {
                                        borderLeft: "1px solid rgba(164,108,252,0.08)",
                                        transition: "opacity 0.8s ease, transform 0.8s ease",
                                        transitionDelay: o ? "200ms" : "0ms",
                                        opacity: o ? 1 : 0,
                                        transform: o ? "translateX(0)" : "translateX(30px)"
                                    },
                                    children: [
                                        e.jsxs("div", {
                                            children: [
                                                e.jsx("p", {
                                                    className: "text-[10px] uppercase tracking-[0.4em] mb-6",
                                                    style: {
                                                        fontFamily: "var(--font-stack-heading)",
                                                        color: "var(--color-secondary)"
                                                    },
                                                    children: "H2H Social"
                                                }),
                                                e.jsx("p", {
                                                    className: "text-sm leading-relaxed max-w-xs",
                                                    style: {
                                                        color: "rgba(232,226,255,0.55)"
                                                    },
                                                    children: "Bridging human potential with digital innovation across Africa and beyond."
                                                })
                                            ]
                                        }),
                                        e.jsxs("div", {
                                            className: "flex items-center gap-4",
                                            children: [
                                                e.jsx("div", {
                                                    className: "h-px flex-1",
                                                    style: {
                                                        background: "rgba(164,108,252,0.1)"
                                                    }
                                                }),
                                                e.jsx("div", {
                                                    className: "w-1.5 h-1.5",
                                                    style: {
                                                        background: "var(--color-secondary)",
                                                        opacity: .4
                                                    }
                                                })
                                            ]
                                        }),
                                        e.jsxs("div", {
                                            className: "space-y-8",
                                            children: [
                                                e.jsxs("div", {
                                                    children: [
                                                        e.jsx("p", {
                                                            className: "text-[10px] uppercase tracking-[0.4em] mb-3",
                                                            style: {
                                                                fontFamily: "var(--font-stack-heading)",
                                                                color: "rgba(232,226,255,0.35)"
                                                            },
                                                            children: "Get in touch"
                                                        }),
                                                        e.jsx("a", {
                                                            href: "#contact",
                                                            onClick: (c)=>k(c, "#contact"),
                                                            className: "text-sm transition-colors duration-300",
                                                            style: {
                                                                color: "rgba(232,226,255,0.55)"
                                                            },
                                                            onMouseEnter: (c)=>{
                                                                c.currentTarget.style.color = "var(--color-secondary)";
                                                            },
                                                            onMouseLeave: (c)=>{
                                                                c.currentTarget.style.color = "rgba(232,226,255,0.55)";
                                                            },
                                                            children: "hello@h2hdigital.com"
                                                        })
                                                    ]
                                                }),
                                                e.jsxs("div", {
                                                    children: [
                                                        e.jsx("p", {
                                                            className: "text-[10px] uppercase tracking-[0.4em] mb-3",
                                                            style: {
                                                                fontFamily: "var(--font-stack-heading)",
                                                                color: "rgba(232,226,255,0.35)"
                                                            },
                                                            children: "Follow us"
                                                        }),
                                                        e.jsx("div", {
                                                            className: "flex gap-4",
                                                            children: Ce.map((c)=>e.jsx("a", {
                                                                    href: c.href,
                                                                    className: "text-[11px] uppercase tracking-widest transition-colors duration-300",
                                                                    style: {
                                                                        fontFamily: "var(--font-stack-heading)",
                                                                        color: "rgba(232,226,255,0.45)"
                                                                    },
                                                                    onMouseEnter: (d)=>{
                                                                        d.currentTarget.style.color = "var(--color-secondary)";
                                                                    },
                                                                    onMouseLeave: (d)=>{
                                                                        d.currentTarget.style.color = "rgba(232,226,255,0.45)";
                                                                    },
                                                                    children: c.label
                                                                }, c.label))
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    ]
                                })
                            ]
                        }),
                        e.jsxs("div", {
                            className: "absolute bottom-0 left-0 right-0 px-4 sm:px-8 md:px-16 py-4 sm:py-5 flex items-center justify-between",
                            style: {
                                borderTop: "1px solid rgba(164,108,252,0.08)",
                                transition: "opacity 0.8s ease",
                                transitionDelay: o ? "350ms" : "0ms",
                                opacity: o ? 1 : 0
                            },
                            children: [
                                e.jsxs("p", {
                                    className: "text-[10px] uppercase tracking-[0.4em]",
                                    style: {
                                        fontFamily: "var(--font-stack-heading)",
                                        color: "rgba(232,226,255,0.3)"
                                    },
                                    children: [
                                        "© ",
                                        new Date().getFullYear(),
                                        " H2H Social"
                                    ]
                                }),
                                e.jsx("div", {
                                    className: "flex lg:hidden gap-5",
                                    children: Ce.map((c)=>e.jsx("a", {
                                            href: c.href,
                                            className: "text-[10px] uppercase tracking-widest transition-colors duration-300",
                                            style: {
                                                fontFamily: "var(--font-stack-heading)",
                                                color: "rgba(232,226,255,0.3)"
                                            },
                                            children: c.label
                                        }, c.label))
                                }),
                                e.jsx("p", {
                                    className: "hidden sm:block text-[10px] uppercase tracking-[0.4em]",
                                    style: {
                                        fontFamily: "var(--font-stack-heading)",
                                        color: "rgba(232,226,255,0.3)"
                                    },
                                    children: "Nairobi · Cape Town"
                                })
                            ]
                        }),
                        e.jsxs("button", {
                            onClick: (c)=>{
                                c.stopPropagation(), r(!1);
                            },
                            className: "absolute top-6 right-6 md:top-8 md:right-10 z-[120] group flex items-center gap-3 transition-colors duration-300",
                            style: {
                                minWidth: 56,
                                minHeight: 56,
                                touchAction: "manipulation",
                                WebkitTapHighlightColor: "transparent",
                                cursor: "pointer",
                                color: "rgba(232,226,255,0.5)"
                            },
                            onMouseEnter: (c)=>{
                                c.currentTarget.style.color = "var(--color-secondary)";
                            },
                            onMouseLeave: (c)=>{
                                c.currentTarget.style.color = "rgba(232,226,255,0.5)";
                            },
                            "aria-label": "Close menu",
                            children: [
                                e.jsx("span", {
                                    className: "text-[10px] uppercase tracking-[0.3em]",
                                    style: {
                                        fontFamily: "var(--font-stack-heading)"
                                    },
                                    children: "Close"
                                }),
                                e.jsx("div", {
                                    className: "relative w-5 h-5",
                                    children: e.jsxs("span", {
                                        className: "absolute inset-0 flex items-center justify-center",
                                        children: [
                                            e.jsx("span", {
                                                className: "absolute h-[1px] w-full bg-current rotate-45 transition-transform duration-300 group-hover:rotate-[135deg]"
                                            }),
                                            e.jsx("span", {
                                                className: "absolute h-[1px] w-full bg-current -rotate-45 transition-transform duration-300 group-hover:rotate-[45deg]"
                                            })
                                        ]
                                    })
                                })
                            ]
                        })
                    ]
                })
            ]
        });
    }
    const It = (t)=>t.replace(/([a-z0-9])([A-Z])/g, "$1-$2").toLowerCase(), Tt = (t)=>t.replace(/^([A-Z])|[\s-_]+(\w)/g, (r, i, a)=>a ? a.toUpperCase() : i.toLowerCase()), Re = (t)=>{
        const r = Tt(t);
        return r.charAt(0).toUpperCase() + r.slice(1);
    }, Oe = (...t)=>t.filter((r, i, a)=>!!r && r.trim() !== "" && a.indexOf(r) === i).join(" ").trim();
    var Nt = {
        xmlns: "http://www.w3.org/2000/svg",
        width: 24,
        height: 24,
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 2,
        strokeLinecap: "round",
        strokeLinejoin: "round"
    };
    const Mt = s.forwardRef(({ color: t = "currentColor", size: r = 24, strokeWidth: i = 2, absoluteStrokeWidth: a, className: o = "", children: n, iconNode: m, ...l }, v)=>s.createElement("svg", {
            ref: v,
            ...Nt,
            width: r,
            height: r,
            stroke: t,
            strokeWidth: a ? Number(i) * 24 / Number(r) : i,
            className: Oe("lucide", o),
            ...l
        }, [
            ...m.map(([b, p])=>s.createElement(b, p)),
            ...Array.isArray(n) ? n : [
                n
            ]
        ]));
    _ = (t, r)=>{
        const i = s.forwardRef(({ className: a, ...o }, n)=>s.createElement(Mt, {
                ref: n,
                iconNode: r,
                className: Oe(`lucide-${It(Re(t))}`, `lucide-${t}`, a),
                ...o
            }));
        return i.displayName = Re(t), i;
    };
    const Ct = [
        [
            "path",
            {
                d: "M7 7h10v10",
                key: "1tivn9"
            }
        ],
        [
            "path",
            {
                d: "M7 17 17 7",
                key: "1vkiza"
            }
        ]
    ], fe = _("arrow-up-right", Ct);
    const Rt = [
        [
            "path",
            {
                d: "M8 2v4",
                key: "1cmpym"
            }
        ],
        [
            "path",
            {
                d: "M16 2v4",
                key: "4m81vk"
            }
        ],
        [
            "rect",
            {
                width: "18",
                height: "18",
                x: "3",
                y: "4",
                rx: "2",
                key: "1hopcy"
            }
        ],
        [
            "path",
            {
                d: "M3 10h18",
                key: "8toen8"
            }
        ]
    ], ye = _("calendar", Rt);
    const Lt = [
        [
            "circle",
            {
                cx: "12",
                cy: "12",
                r: "10",
                key: "1mglay"
            }
        ],
        [
            "polyline",
            {
                points: "12 6 12 12 16 14",
                key: "68esgv"
            }
        ]
    ], ve = _("clock", Lt);
    const Ft = [
        [
            "rect",
            {
                width: "20",
                height: "20",
                x: "2",
                y: "2",
                rx: "5",
                ry: "5",
                key: "2e1cvw"
            }
        ],
        [
            "path",
            {
                d: "M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z",
                key: "9exkf1"
            }
        ],
        [
            "line",
            {
                x1: "17.5",
                x2: "17.51",
                y1: "6.5",
                y2: "6.5",
                key: "r4j83e"
            }
        ]
    ], zt = _("instagram", Ft);
    const Et = [
        [
            "path",
            {
                d: "M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z",
                key: "c2jq9f"
            }
        ],
        [
            "rect",
            {
                width: "4",
                height: "12",
                x: "2",
                y: "9",
                key: "mk3on5"
            }
        ],
        [
            "circle",
            {
                cx: "4",
                cy: "4",
                r: "2",
                key: "bt5ra8"
            }
        ]
    ], At = _("linkedin", Et);
    const Pt = [
        [
            "rect",
            {
                width: "20",
                height: "16",
                x: "2",
                y: "4",
                rx: "2",
                key: "18n3k1"
            }
        ],
        [
            "path",
            {
                d: "m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7",
                key: "1ocrg3"
            }
        ]
    ], Bt = _("mail", Pt);
    const Ht = [
        [
            "path",
            {
                d: "M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z",
                key: "1lielz"
            }
        ]
    ], Wt = _("message-square", Ht);
    const _t = [
        [
            "polygon",
            {
                points: "6 3 20 12 6 21 6 3",
                key: "1oa8hb"
            }
        ]
    ], Ot = _("play", _t);
    const Dt = [
        [
            "path",
            {
                d: "M14.536 21.686a.5.5 0 0 0 .937-.024l6.5-19a.496.496 0 0 0-.635-.635l-19 6.5a.5.5 0 0 0-.024.937l7.93 3.18a2 2 0 0 1 1.112 1.11z",
                key: "1ffxy3"
            }
        ],
        [
            "path",
            {
                d: "m21.854 2.147-10.94 10.939",
                key: "12cjpa"
            }
        ]
    ], Gt = _("send", Dt);
    const qt = [
        [
            "path",
            {
                d: "M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z",
                key: "pff0z6"
            }
        ]
    ], $t = _("twitter", qt);
    let Yt;
    Yt = [
        [
            "path",
            {
                d: "M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2",
                key: "975kel"
            }
        ],
        [
            "circle",
            {
                cx: "12",
                cy: "7",
                r: "4",
                key: "17ys0d"
            }
        ]
    ];
    be = _("user", Yt);
    let Vt, Ut;
    Vt = [
        [
            "path",
            {
                d: "M18 6 6 18",
                key: "1bl5f8"
            }
        ],
        [
            "path",
            {
                d: "m6 6 12 12",
                key: "d8bk6v"
            }
        ]
    ];
    De = _("x", Vt);
    Ut = "https://ik.imagekit.io/qcvroy8xpd/IMG_9186%20(1).mp4";
    function Xt() {
        const t = s.useRef(null), r = s.useRef(0);
        return s.useEffect(()=>{
            const i = t.current;
            if (!i) return;
            const a = i.getContext("2d");
            if (!a) return;
            const o = ()=>{
                i.width = i.offsetWidth * window.devicePixelRatio, i.height = i.offsetHeight * window.devicePixelRatio, a.scale(window.devicePixelRatio, window.devicePixelRatio);
            };
            o(), window.addEventListener("resize", o);
            const n = ()=>i.offsetWidth, m = ()=>i.offsetHeight, l = [];
            for(let p = 0; p < 220; p++)l.push({
                x: Math.random(),
                y: Math.random(),
                r: .3 + Math.random() * 1.2,
                a: .3 + Math.random() * .7,
                phase: Math.random() * Math.PI * 2,
                speed: .008 + Math.random() * .018
            });
            let v = 0;
            const b = ()=>{
                const p = n(), y = m();
                a.clearRect(0, 0, p, y);
                const u = a.createRadialGradient(p * .5, y * .5, 0, p * .5, y * .5, p * .8);
                u.addColorStop(0, "#050118"), u.addColorStop(.5, "#030112"), u.addColorStop(1, "#010008"), a.fillStyle = u, a.fillRect(0, 0, p, y), v += .008;
                for (const c of l){
                    const d = c.a * (.5 + .5 * Math.sin(c.phase + v * c.speed * 10));
                    a.beginPath(), a.arc(c.x * p, c.y * y, c.r, 0, Math.PI * 2), a.fillStyle = `rgba(200, 210, 255, ${d})`, a.fill();
                }
                const h = p * .12, w = y * .28, g = Math.min(p, y) * .06, S = a.createRadialGradient(h, w, 0, h, w, g * 2.5);
                S.addColorStop(0, "rgba(164,108,252,0.08)"), S.addColorStop(1, "rgba(0,0,0,0)"), a.fillStyle = S, a.fillRect(h - g * 3, w - g * 3, g * 6, g * 6), a.save(), a.beginPath(), a.ellipse(h, w, g * 2.2, g * .45, -.3, Math.PI, Math.PI * 2), a.strokeStyle = "rgba(164,108,252,0.18)", a.lineWidth = g * .35, a.stroke(), a.beginPath(), a.ellipse(h, w, g * 2.6, g * .55, -.3, Math.PI, Math.PI * 2), a.strokeStyle = "rgba(140,90,252,0.10)", a.lineWidth = g * .18, a.stroke(), a.restore();
                const k = a.createRadialGradient(h - g * .25, w - g * .25, 0, h, w, g);
                k.addColorStop(0, "rgba(200,160,255,0.55)"), k.addColorStop(.5, "rgba(120,60,200,0.45)"), k.addColorStop(1, "rgba(40,10,100,0.6)"), a.beginPath(), a.arc(h, w, g, 0, Math.PI * 2), a.fillStyle = k, a.fill(), a.beginPath(), a.arc(h, w, g, 0, Math.PI * 2), a.strokeStyle = "rgba(164,108,252,0.35)", a.lineWidth = 1, a.stroke(), a.save(), a.beginPath(), a.ellipse(h, w, g * 2.2, g * .45, -.3, 0, Math.PI), a.strokeStyle = "rgba(164,108,252,0.22)", a.lineWidth = g * .35, a.stroke(), a.beginPath(), a.ellipse(h, w, g * 2.6, g * .55, -.3, 0, Math.PI), a.strokeStyle = "rgba(140,90,252,0.12)", a.lineWidth = g * .18, a.stroke(), a.restore();
                const f = p * .88, I = y * .22, L = Math.min(p, y) * .07;
                for(let c = 0; c < 3; c++){
                    const d = c / 3 * Math.PI * 2;
                    for(let M = 0; M < 60; M++){
                        const P = M / 60, O = d + P * Math.PI * 2.5 + v * .05, D = P * L, G = f + Math.cos(O) * D, C = I + Math.sin(O) * D * .5, R = (1 - P) * .35, W = .5 + (1 - P) * 1.5;
                        a.beginPath(), a.arc(G, C, W, 0, Math.PI * 2);
                        const V = c === 0 ? "164,108,252" : c === 1 ? "180,120,255" : "200,140,255";
                        a.fillStyle = `rgba(${V},${R})`, a.fill();
                    }
                }
                const j = a.createRadialGradient(f, I, 0, f, I, L * .4);
                j.addColorStop(0, "rgba(200,160,255,0.25)"), j.addColorStop(1, "rgba(100,50,200,0)"), a.fillStyle = j, a.beginPath(), a.ellipse(f, I, L * .4, L * .2, 0, 0, Math.PI * 2), a.fill(), r.current = requestAnimationFrame(b);
            };
            return r.current = requestAnimationFrame(b), ()=>{
                cancelAnimationFrame(r.current), window.removeEventListener("resize", o);
            };
        }, []), e.jsx("canvas", {
            ref: t,
            style: {
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none"
            }
        });
    }
    function Kt({ size: t }) {
        const r = s.useRef(null), i = s.useRef(0);
        return s.useEffect(()=>{
            const a = r.current;
            if (!a) return;
            const o = a.getContext("2d");
            if (!o) return;
            a.width = t * window.devicePixelRatio, a.height = t * window.devicePixelRatio, o.scale(window.devicePixelRatio, window.devicePixelRatio);
            const n = t / 2, m = t / 2, l = t * .42;
            let v = 0;
            const b = (y, u)=>{
                const h = l * Math.cos(y) * Math.sin(u + v), w = l * Math.sin(y), g = l * Math.cos(y) * Math.cos(u + v), S = (g + l * 1.5) / (l * 2.5);
                return {
                    x: n + h * S,
                    y: m - w * S,
                    z: g,
                    scale: S
                };
            }, p = ()=>{
                o.clearRect(0, 0, t, t), v += .004;
                const y = o.createRadialGradient(n, m, l * .5, n, m, l * 1.2);
                y.addColorStop(0, "rgba(164,108,252,0.06)"), y.addColorStop(1, "rgba(0,0,0,0)"), o.fillStyle = y, o.fillRect(0, 0, t, t);
                for(let h = -3; h <= 3; h++){
                    const w = h / 4 * (Math.PI / 2) * .95;
                    o.beginPath();
                    let g = !1;
                    for(let S = 0; S <= 64; S++){
                        const k = S / 64 * Math.PI * 2, f = b(w, k);
                        g ? o.lineTo(f.x, f.y) : (o.moveTo(f.x, f.y), g = !0);
                    }
                    o.closePath(), o.strokeStyle = "rgba(164,108,252,0.35)", o.lineWidth = .6, o.stroke();
                }
                for(let h = 0; h < 12; h++){
                    const w = h / 12 * Math.PI * 2;
                    o.beginPath();
                    let g = !1;
                    for(let S = 0; S <= 48; S++){
                        const k = (S / 48 - .5) * Math.PI, f = b(k, w);
                        g ? o.lineTo(f.x, f.y) : (o.moveTo(f.x, f.y), g = !0);
                    }
                    o.strokeStyle = "rgba(164,108,252,0.25)", o.lineWidth = .5, o.stroke();
                }
                o.beginPath();
                for(let h = 0; h <= 64; h++){
                    const w = h / 64 * Math.PI * 2, g = b(0, w);
                    h === 0 ? o.moveTo(g.x, g.y) : o.lineTo(g.x, g.y);
                }
                o.closePath(), o.strokeStyle = "rgba(180,120,255,0.6)", o.lineWidth = 1, o.stroke(), o.beginPath(), o.arc(n, m, l, 0, Math.PI * 2), o.strokeStyle = "rgba(164,108,252,0.45)", o.lineWidth = 1.5, o.stroke();
                const u = o.createRadialGradient(n, m, l * .6, n, m, l);
                u.addColorStop(0, "rgba(100,50,220,0)"), u.addColorStop(1, "rgba(120,60,230,0.06)"), o.fillStyle = u, o.beginPath(), o.arc(n, m, l, 0, Math.PI * 2), o.fill(), i.current = requestAnimationFrame(p);
            };
            return i.current = requestAnimationFrame(p), ()=>cancelAnimationFrame(i.current);
        }, [
            t
        ]), e.jsx("canvas", {
            ref: r,
            style: {
                width: t,
                height: t,
                display: "block"
            }
        });
    }
    function Zt({ width: t, height: r }) {
        const i = s.useRef(null), a = s.useRef(0);
        return s.useEffect(()=>{
            const o = i.current;
            if (!o) return;
            const n = o.getContext("2d");
            if (!n) return;
            o.width = t * window.devicePixelRatio, o.height = r * window.devicePixelRatio, n.scale(window.devicePixelRatio, window.devicePixelRatio);
            const m = t / 2, l = r * .38, v = t * .46, b = r * .28;
            let p = 0, y = 0;
            const u = ()=>{
                n.clearRect(0, 0, t, r), p += .015, y = (y + .008) % (Math.PI * 2);
                const h = n.createRadialGradient(m, l + b * .2, 0, m, l, v * 1.1);
                h.addColorStop(0, `rgba(140,80,240,${.06 + .03 * Math.sin(p)})`), h.addColorStop(.5, "rgba(80,40,180,0.04)"), h.addColorStop(1, "rgba(0,0,0,0)"), n.fillStyle = h, n.fillRect(0, 0, t, r), n.save(), n.beginPath(), n.ellipse(m, l, v, b, 0, 0, Math.PI * 2), n.clip();
                const w = n.createRadialGradient(m, l, 0, m, l, v);
                w.addColorStop(0, "rgba(80,40,160,0.35)"), w.addColorStop(.6, "rgba(50,20,120,0.25)"), w.addColorStop(1, "rgba(20,10,60,0.15)"), n.fillStyle = w, n.fillRect(0, 0, t, r);
                const g = 16;
                for(let k = 0; k < g; k++){
                    const f = k / g * Math.PI * 2, I = m + Math.cos(f) * v, L = l + Math.sin(f) * b;
                    n.beginPath(), n.moveTo(m, l), n.lineTo(I, L), n.strokeStyle = "rgba(164,108,252,0.12)", n.lineWidth = .5, n.stroke();
                }
                const S = 6;
                for(let k = 1; k <= S; k++){
                    const f = k / S, I = k === 1 ? .55 + .15 * Math.sin(p * 1.5) : .12 + .05 * Math.sin(p + k);
                    n.beginPath(), n.ellipse(m, l, v * f, b * f, 0, 0, Math.PI * 2), n.strokeStyle = `rgba(164,108,252,${I})`, n.lineWidth = k === 1 ? 1.5 : .5, n.stroke();
                }
                n.beginPath(), n.moveTo(m, l), n.arc(m, l, v, y, y + .3), n.lineTo(m, l), n.fillStyle = "rgba(164,108,252,0.08)", n.fill(), n.restore(), n.beginPath(), n.ellipse(m, l, v, b, 0, 0, Math.PI * 2), n.strokeStyle = `rgba(164,108,252,${.5 + .2 * Math.sin(p)})`, n.lineWidth = 1.5, n.stroke(), n.beginPath(), n.ellipse(m, l, v * 1.04, b * 1.04, 0, 0, Math.PI * 2), n.strokeStyle = `rgba(140,90,252,${.12 + .06 * Math.sin(p * .7)})`, n.lineWidth = 4, n.stroke(), a.current = requestAnimationFrame(u);
            };
            return a.current = requestAnimationFrame(u), ()=>cancelAnimationFrame(a.current);
        }, [
            t,
            r
        ]), e.jsx("canvas", {
            ref: i,
            style: {
                position: "absolute",
                bottom: 0,
                left: 0,
                width: t,
                height: r,
                display: "block",
                pointerEvents: "none"
            }
        });
    }
    function Le({ isOpen: t, onClose: r, title: i = "Meet the Founder", videoUrl: a }) {
        const o = a ?? Ut, n = s.useRef(null), m = s.useRef(null), l = s.useRef(0), [v, b] = s.useState(!1), [p, y] = s.useState(!1), [u, h] = s.useState(0), w = s.useRef({
            x: .5,
            y: .5
        });
        s.useEffect(()=>{
            const j = (c)=>{
                c.key === "Escape" && r();
            };
            if (t) {
                document.addEventListener("keydown", j), document.body.style.overflow = "hidden", h(0);
                const c = setTimeout(()=>h(1), 200), d = setTimeout(()=>h(2), 700), M = setTimeout(()=>h(3), 1200);
                return ()=>{
                    document.removeEventListener("keydown", j), document.body.style.overflow = "", clearTimeout(c), clearTimeout(d), clearTimeout(M);
                };
            }
            return ()=>{
                document.removeEventListener("keydown", j), document.body.style.overflow = "";
            };
        }, [
            t,
            r
        ]), s.useEffect(()=>{
            !t && n.current && (n.current.pause(), n.current.currentTime = 0, b(!1), y(!1), h(0));
        }, [
            t
        ]);
        const g = s.useCallback((j)=>{
            const c = j.currentTarget.getBoundingClientRect();
            w.current = {
                x: (j.clientX - c.left) / c.width,
                y: (j.clientY - c.top) / c.height
            };
        }, []);
        s.useEffect(()=>{
            if (!v || !n.current || !m.current) return;
            const j = n.current, c = m.current, d = c.getContext("2d");
            if (!d) return;
            let M = 0, P = 0, O = 0, D = 0;
            const G = ()=>{
                if (!j || j.paused || j.ended) return;
                const C = j.videoWidth || 640, R = j.videoHeight || 360;
                c.width = C, c.height = R, O++, D += .015, d.clearRect(0, 0, C, R);
                const W = Math.sin(D) * 5;
                d.save(), d.globalAlpha = .3, d.globalCompositeOperation = "screen", d.drawImage(j, W, 0, C, R), d.restore(), d.save(), d.globalAlpha = .85, d.drawImage(j, 0, 0, C, R), d.restore(), d.save(), d.globalAlpha = .2, d.globalCompositeOperation = "screen", d.drawImage(j, -W * .7, 0, C, R), d.restore(), d.save(), d.globalAlpha = .2, d.globalCompositeOperation = "screen", d.drawImage(j, -W * .5, W * .3, C, R), d.restore(), d.save(), d.globalCompositeOperation = "overlay";
                const V = .07 + .04 * Math.sin(O * .05);
                for(let B = 0; B < R; B += 2){
                    const q = B % 4 === 0 ? V * 1.5 : V;
                    d.fillStyle = `rgba(164,108,252,${q})`, d.fillRect(0, B, C, 1);
                }
                d.restore(), M = (M + 1.5) % R, P = (P + .8) % R;
                const se = O * 2.5 % R;
                d.save(), d.globalCompositeOperation = "screen";
                const U = (B, q, E, K)=>{
                    const $ = d.createLinearGradient(0, B - q, 0, B + q);
                    $.addColorStop(0, "rgba(0,0,0,0)"), $.addColorStop(.5, `rgba(${K},${E})`), $.addColorStop(1, "rgba(0,0,0,0)"), d.fillStyle = $, d.fillRect(0, B - q, C, q * 2);
                };
                if (U(M, 25, .18, "164,108,252"), U(P, 15, .1, "164,108,252"), U(se, 8, .08, "180,120,255"), d.restore(), Math.random() > .9) {
                    const B = 1 + Math.floor(Math.random() * 3);
                    for(let q = 0; q < B; q++){
                        const E = Math.random() * R, K = 1 + Math.random() * 8, $ = (Math.random() - .5) * 30;
                        d.save(), d.globalAlpha = .5 + Math.random() * .4;
                        try {
                            const Z = d.getImageData(0, Math.max(0, E), C, Math.min(K, R - E));
                            d.putImageData(Z, $, E);
                        } catch  {}
                        d.restore();
                    }
                }
                const X = d.createRadialGradient(C / 2, R / 2, C * .25, C / 2, R / 2, C * .7);
                X.addColorStop(0, "rgba(0,0,0,0)"), X.addColorStop(1, "rgba(5,2,20,0.45)"), d.fillStyle = X, d.fillRect(0, 0, C, R), l.current = requestAnimationFrame(G);
            };
            return l.current = requestAnimationFrame(G), ()=>{
                l.current && cancelAnimationFrame(l.current);
            };
        }, [
            v
        ]);
        const S = ()=>{
            n.current && (n.current.play(), b(!0));
        }, k = ()=>b(!1), f = 160, I = 520, L = 120;
        return e.jsx(ne, {
            children: t && e.jsxs(x.div, {
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                transition: {
                    duration: .5
                },
                onClick: r,
                className: "fixed inset-0 flex flex-col items-center justify-center",
                style: {
                    zIndex: 9999,
                    background: "rgba(4,2,16,0.98)",
                    backdropFilter: "blur(8px)"
                },
                children: [
                    e.jsx(Xt, {}),
                    e.jsxs(x.div, {
                        initial: {
                            opacity: 0,
                            scale: .8,
                            y: 40
                        },
                        animate: {
                            opacity: 1,
                            scale: 1,
                            y: 0
                        },
                        exit: {
                            opacity: 0,
                            scale: .85,
                            y: 30
                        },
                        transition: {
                            type: "spring",
                            stiffness: 180,
                            damping: 22,
                            mass: .9
                        },
                        style: {
                            position: "relative",
                            zIndex: 10,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center"
                        },
                        onClick: (j)=>j.stopPropagation(),
                        onMouseMove: g,
                        children: [
                            e.jsx(x.button, {
                                onClick: r,
                                "aria-label": "Close",
                                style: {
                                    position: "absolute",
                                    top: -44,
                                    right: 0,
                                    width: 40,
                                    height: 40,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    background: "rgba(164,108,252,0.04)",
                                    border: "1px solid rgba(164,108,252,0.25)",
                                    borderRadius: 2,
                                    color: "rgba(164,108,252,0.7)",
                                    cursor: "pointer",
                                    zIndex: 10
                                },
                                whileHover: {
                                    background: "rgba(164,108,252,0.12)",
                                    borderColor: "rgba(164,108,252,0.6)",
                                    color: "rgba(180,130,255,1)",
                                    boxShadow: "0 0 20px rgba(164,108,252,0.3)"
                                },
                                whileTap: {
                                    scale: .9
                                },
                                children: e.jsx(De, {
                                    size: 16,
                                    strokeWidth: 2
                                })
                            }),
                            e.jsxs(x.div, {
                                style: {
                                    position: "relative",
                                    zIndex: 3
                                },
                                animate: {
                                    y: [
                                        0,
                                        -8,
                                        0
                                    ]
                                },
                                transition: {
                                    duration: 4,
                                    repeat: 1 / 0,
                                    ease: "easeInOut"
                                },
                                children: [
                                    e.jsx(Kt, {
                                        size: f
                                    }),
                                    e.jsx("div", {
                                        style: {
                                            position: "absolute",
                                            bottom: -4,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 40,
                                            height: 12,
                                            background: "radial-gradient(ellipse, rgba(164,108,252,0.6) 0%, transparent 70%)",
                                            filter: "blur(4px)"
                                        }
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                style: {
                                    position: "relative",
                                    width: 2,
                                    zIndex: 2,
                                    overflow: "visible"
                                },
                                children: [
                                    e.jsx(x.div, {
                                        style: {
                                            width: 2,
                                            height: 90,
                                            background: "linear-gradient(to bottom, rgba(164,108,252,0.9), rgba(164,108,252,0.2))",
                                            margin: "0 auto",
                                            boxShadow: "0 0 8px rgba(164,108,252,0.6), 0 0 20px rgba(164,108,252,0.3)"
                                        },
                                        animate: {
                                            opacity: [
                                                .6,
                                                1,
                                                .6
                                            ]
                                        },
                                        transition: {
                                            duration: 1.5,
                                            repeat: 1 / 0,
                                            ease: "easeInOut"
                                        }
                                    }),
                                    e.jsx(x.div, {
                                        style: {
                                            position: "absolute",
                                            top: 0,
                                            left: "50%",
                                            transform: "translateX(-50%)",
                                            width: 20,
                                            height: 90,
                                            background: "linear-gradient(to bottom, rgba(164,108,252,0.15), rgba(164,108,252,0.03))",
                                            filter: "blur(6px)"
                                        },
                                        animate: {
                                            opacity: [
                                                .4,
                                                .8,
                                                .4
                                            ]
                                        },
                                        transition: {
                                            duration: 2,
                                            repeat: 1 / 0,
                                            ease: "easeInOut"
                                        }
                                    }),
                                    [
                                        0,
                                        .33,
                                        .66
                                    ].map((j, c)=>e.jsx(x.div, {
                                            style: {
                                                position: "absolute",
                                                left: "50%",
                                                transform: "translateX(-50%)",
                                                width: 3,
                                                height: 3,
                                                borderRadius: "50%",
                                                background: "rgba(180,120,255,0.9)",
                                                boxShadow: "0 0 6px rgba(164,108,252,0.8)"
                                            },
                                            animate: {
                                                top: [
                                                    0,
                                                    90
                                                ],
                                                opacity: [
                                                    0,
                                                    1,
                                                    0
                                                ]
                                            },
                                            transition: {
                                                duration: 1.2,
                                                repeat: 1 / 0,
                                                delay: j,
                                                ease: "linear"
                                            }
                                        }, c))
                                ]
                            }),
                            e.jsxs("div", {
                                style: {
                                    position: "relative",
                                    width: I,
                                    zIndex: 4
                                },
                                children: [
                                    e.jsx(Zt, {
                                        width: I,
                                        height: L
                                    }),
                                    e.jsx("div", {
                                        style: {
                                            position: "relative",
                                            zIndex: 5,
                                            marginTop: -L * .1
                                        },
                                        children: e.jsxs(x.div, {
                                            style: {
                                                position: "relative",
                                                maxWidth: 700,
                                                width: "100%",
                                                margin: "0 auto"
                                            },
                                            animate: {
                                                boxShadow: [
                                                    "0 0 30px rgba(164,108,252,0.12)",
                                                    "0 0 60px rgba(164,108,252,0.22)",
                                                    "0 0 30px rgba(164,108,252,0.12)"
                                                ]
                                            },
                                            transition: {
                                                duration: 2.5,
                                                repeat: 1 / 0,
                                                ease: "easeInOut"
                                            },
                                            children: [
                                                e.jsx(x.div, {
                                                    style: {
                                                        position: "absolute",
                                                        inset: -1,
                                                        borderRadius: 3,
                                                        border: "1.5px solid",
                                                        zIndex: 2,
                                                        pointerEvents: "none"
                                                    },
                                                    animate: {
                                                        borderColor: [
                                                            "rgba(164,108,252,0.6)",
                                                            "rgba(200,140,255,0.7)",
                                                            "rgba(130,70,240,0.5)",
                                                            "rgba(164,108,252,0.6)"
                                                        ]
                                                    },
                                                    transition: {
                                                        duration: 2,
                                                        repeat: 1 / 0,
                                                        ease: "linear"
                                                    }
                                                }),
                                                e.jsxs("div", {
                                                    style: {
                                                        position: "relative",
                                                        width: "100%",
                                                        aspectRatio: "16/9",
                                                        overflow: "hidden",
                                                        background: "#050218",
                                                        borderRadius: 3,
                                                        border: "1px solid rgba(164,108,252,0.15)"
                                                    },
                                                    children: [
                                                        e.jsx("video", {
                                                            ref: n,
                                                            src: o,
                                                            playsInline: !0,
                                                            onCanPlay: ()=>y(!0),
                                                            onEnded: k,
                                                            style: {
                                                                position: "absolute",
                                                                inset: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                opacity: 0,
                                                                pointerEvents: "none"
                                                            }
                                                        }),
                                                        e.jsx("canvas", {
                                                            ref: m,
                                                            style: {
                                                                position: "absolute",
                                                                inset: 0,
                                                                width: "100%",
                                                                height: "100%",
                                                                objectFit: "cover",
                                                                display: v ? "block" : "none"
                                                            }
                                                        }),
                                                        [
                                                            [
                                                                "top-0 left-0",
                                                                "M0,16 L16,0"
                                                            ],
                                                            [
                                                                "top-0 right-0 scale-x-[-1]",
                                                                "M0,16 L16,0"
                                                            ],
                                                            [
                                                                "bottom-0 left-0 scale-y-[-1]",
                                                                "M0,16 L16,0"
                                                            ],
                                                            [
                                                                "bottom-0 right-0 scale-x-[-1] scale-y-[-1]",
                                                                "M0,16 L16,0"
                                                            ]
                                                        ].map(([j, c], d)=>e.jsx("svg", {
                                                                className: `absolute ${j}`,
                                                                style: {
                                                                    width: 24,
                                                                    height: 24,
                                                                    opacity: .7
                                                                },
                                                                children: e.jsx(x.path, {
                                                                    d: c,
                                                                    stroke: "rgba(164,108,252,0.8)",
                                                                    strokeWidth: "1.5",
                                                                    fill: "none",
                                                                    initial: {
                                                                        pathLength: 0
                                                                    },
                                                                    animate: {
                                                                        pathLength: 1
                                                                    },
                                                                    transition: {
                                                                        duration: .8,
                                                                        delay: d * .1
                                                                    }
                                                                })
                                                            }, d)),
                                                        !v && u >= 1 && e.jsxs(x.div, {
                                                            initial: {
                                                                opacity: 0
                                                            },
                                                            animate: {
                                                                opacity: 1
                                                            },
                                                            transition: {
                                                                duration: .6
                                                            },
                                                            className: "absolute inset-0 flex flex-col items-center justify-center gap-5",
                                                            style: {
                                                                background: "radial-gradient(ellipse at center, rgba(164,108,252,0.04) 0%, transparent 60%)"
                                                            },
                                                            children: [
                                                                u < 3 && e.jsx(x.div, {
                                                                    style: {
                                                                        fontSize: "0.55rem",
                                                                        letterSpacing: "0.2em",
                                                                        fontFamily: "monospace",
                                                                        textAlign: "center"
                                                                    },
                                                                    animate: {
                                                                        opacity: [
                                                                            0,
                                                                            1,
                                                                            .6
                                                                        ]
                                                                    },
                                                                    transition: {
                                                                        duration: .8
                                                                    },
                                                                    children: e.jsx("span", {
                                                                        style: {
                                                                            color: u === 1 ? "rgba(164,108,252,0.7)" : "rgba(180,120,255,0.6)"
                                                                        },
                                                                        children: u === 1 ? "INITIALIZING HOLOGRAPHIC MATRIX..." : "CALIBRATING SIGNAL..."
                                                                    })
                                                                }),
                                                                u >= 3 && e.jsxs(e.Fragment, {
                                                                    children: [
                                                                        e.jsxs(x.div, {
                                                                            style: {
                                                                                width: 110,
                                                                                height: 110,
                                                                                position: "relative",
                                                                                display: "flex",
                                                                                alignItems: "center",
                                                                                justifyContent: "center",
                                                                                cursor: p ? "pointer" : "default"
                                                                            },
                                                                            whileHover: p ? {
                                                                                scale: 1.06
                                                                            } : {},
                                                                            whileTap: p ? {
                                                                                scale: .94
                                                                            } : {},
                                                                            onClick: p ? S : void 0,
                                                                            children: [
                                                                                e.jsx(x.div, {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        inset: 0,
                                                                                        borderRadius: "50%",
                                                                                        border: "1.5px solid rgba(164,108,252,0.5)"
                                                                                    },
                                                                                    animate: {
                                                                                        scale: [
                                                                                            1,
                                                                                            1.15,
                                                                                            1
                                                                                        ],
                                                                                        opacity: [
                                                                                            .4,
                                                                                            .8,
                                                                                            .4
                                                                                        ]
                                                                                    },
                                                                                    transition: {
                                                                                        duration: 2.5,
                                                                                        repeat: 1 / 0,
                                                                                        ease: "easeInOut"
                                                                                    }
                                                                                }),
                                                                                e.jsx(x.div, {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        inset: -10,
                                                                                        borderRadius: "50%",
                                                                                        border: "1px solid rgba(164,108,252,0.2)"
                                                                                    },
                                                                                    animate: {
                                                                                        rotate: 360
                                                                                    },
                                                                                    transition: {
                                                                                        duration: 8,
                                                                                        repeat: 1 / 0,
                                                                                        ease: "linear"
                                                                                    }
                                                                                }),
                                                                                e.jsx(x.div, {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        inset: -20,
                                                                                        borderRadius: "50%",
                                                                                        border: "1px dashed rgba(164,108,252,0.15)"
                                                                                    },
                                                                                    animate: {
                                                                                        rotate: -360
                                                                                    },
                                                                                    transition: {
                                                                                        duration: 16,
                                                                                        repeat: 1 / 0,
                                                                                        ease: "linear"
                                                                                    }
                                                                                }),
                                                                                e.jsx(x.div, {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        inset: -30,
                                                                                        borderRadius: "50%",
                                                                                        border: "1px solid transparent"
                                                                                    },
                                                                                    animate: {
                                                                                        borderColor: [
                                                                                            "rgba(164,108,252,0.12)",
                                                                                            "rgba(180,120,255,0.12)",
                                                                                            "rgba(164,108,252,0.12)"
                                                                                        ]
                                                                                    },
                                                                                    transition: {
                                                                                        duration: 2,
                                                                                        repeat: 1 / 0
                                                                                    }
                                                                                }),
                                                                                e.jsx("svg", {
                                                                                    style: {
                                                                                        position: "absolute",
                                                                                        inset: 0,
                                                                                        width: "100%",
                                                                                        height: "100%"
                                                                                    },
                                                                                    children: e.jsx(x.circle, {
                                                                                        cx: "55",
                                                                                        cy: "55",
                                                                                        r: "50",
                                                                                        fill: "none",
                                                                                        stroke: "rgba(164,108,252,0.6)",
                                                                                        strokeWidth: "1.5",
                                                                                        strokeDasharray: "6 10",
                                                                                        animate: {
                                                                                            rotate: 360
                                                                                        },
                                                                                        transition: {
                                                                                            duration: 12,
                                                                                            repeat: 1 / 0,
                                                                                            ease: "linear"
                                                                                        },
                                                                                        style: {
                                                                                            transformOrigin: "center"
                                                                                        }
                                                                                    })
                                                                                }),
                                                                                e.jsx(x.div, {
                                                                                    style: {
                                                                                        width: 52,
                                                                                        height: 52,
                                                                                        borderRadius: "50%",
                                                                                        background: "radial-gradient(circle, rgba(164,108,252,0.15) 0%, rgba(120,60,220,0.05) 50%, transparent 70%)",
                                                                                        display: "flex",
                                                                                        alignItems: "center",
                                                                                        justifyContent: "center"
                                                                                    },
                                                                                    animate: {
                                                                                        boxShadow: [
                                                                                            "0 0 20px rgba(164,108,252,0.1)",
                                                                                            "0 0 40px rgba(164,108,252,0.25)",
                                                                                            "0 0 20px rgba(164,108,252,0.1)"
                                                                                        ]
                                                                                    },
                                                                                    transition: {
                                                                                        duration: 2,
                                                                                        repeat: 1 / 0
                                                                                    },
                                                                                    children: e.jsx(Ot, {
                                                                                        size: 24,
                                                                                        fill: "rgba(164,108,252,0.8)",
                                                                                        stroke: "rgba(180,130,255,0.9)",
                                                                                        strokeWidth: 1.5,
                                                                                        style: {
                                                                                            marginLeft: 3
                                                                                        }
                                                                                    })
                                                                                })
                                                                            ]
                                                                        }),
                                                                        e.jsx(x.p, {
                                                                            initial: {
                                                                                opacity: 0,
                                                                                y: 8
                                                                            },
                                                                            animate: {
                                                                                opacity: 1,
                                                                                y: 0
                                                                            },
                                                                            transition: {
                                                                                delay: .3
                                                                            },
                                                                            style: {
                                                                                fontSize: "0.6rem",
                                                                                letterSpacing: "0.3em",
                                                                                textTransform: "uppercase",
                                                                                fontFamily: "monospace",
                                                                                background: "linear-gradient(90deg, rgba(164,108,252,0.9), rgba(200,140,255,0.9))",
                                                                                WebkitBackgroundClip: "text",
                                                                                WebkitTextFillColor: "transparent"
                                                                            },
                                                                            children: p ? "[ ENGAGE HOLOGRAM ]" : "[ ACQUIRING SIGNAL... ]"
                                                                        })
                                                                    ]
                                                                })
                                                            ]
                                                        }),
                                                        v && e.jsxs(x.div, {
                                                            initial: {
                                                                opacity: 0
                                                            },
                                                            animate: {
                                                                opacity: 1
                                                            },
                                                            transition: {
                                                                delay: .5
                                                            },
                                                            style: {
                                                                position: "absolute",
                                                                bottom: 0,
                                                                left: 0,
                                                                right: 0,
                                                                height: 60,
                                                                background: "linear-gradient(to top, rgba(5,2,24,0.85), transparent)",
                                                                pointerEvents: "none",
                                                                display: "flex",
                                                                alignItems: "flex-end",
                                                                justifyContent: "space-between",
                                                                padding: "0 14px 10px"
                                                            },
                                                            children: [
                                                                e.jsx("span", {
                                                                    style: {
                                                                        color: "rgba(164,108,252,0.5)",
                                                                        fontSize: "0.5rem",
                                                                        letterSpacing: "0.18em",
                                                                        textTransform: "uppercase",
                                                                        fontFamily: "monospace"
                                                                    },
                                                                    children: "Holographic Feed Active"
                                                                }),
                                                                e.jsx(x.div, {
                                                                    style: {
                                                                        display: "flex",
                                                                        gap: 2
                                                                    },
                                                                    animate: {
                                                                        opacity: [
                                                                            .3,
                                                                            .8,
                                                                            .3
                                                                        ]
                                                                    },
                                                                    transition: {
                                                                        duration: 1.5,
                                                                        repeat: 1 / 0
                                                                    },
                                                                    children: [
                                                                        ...Array(5)
                                                                    ].map((j, c)=>e.jsx(x.div, {
                                                                            style: {
                                                                                width: 2,
                                                                                background: "rgba(164,108,252,0.6)",
                                                                                borderRadius: 1
                                                                            },
                                                                            animate: {
                                                                                height: [
                                                                                    4,
                                                                                    8 + Math.random() * 8,
                                                                                    4
                                                                                ]
                                                                            },
                                                                            transition: {
                                                                                duration: .6,
                                                                                repeat: 1 / 0,
                                                                                delay: c * .08
                                                                            }
                                                                        }, c))
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                })
                                            ]
                                        })
                                    })
                                ]
                            }),
                            e.jsx(x.p, {
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    delay: .7
                                },
                                style: {
                                    textAlign: "center",
                                    marginTop: 20,
                                    fontSize: "0.7rem",
                                    letterSpacing: "0.25em",
                                    textTransform: "uppercase",
                                    fontFamily: "var(--font-stack-heading)",
                                    color: "rgba(164,108,252,0.5)"
                                },
                                children: i
                            })
                        ]
                    }, "holo-content")
                ]
            }, "holo-backdrop")
        });
    }
    const Jt = [
        [
            "from",
            "B2B",
            "to",
            "H2H"
        ],
        [
            "Build",
            "a",
            "Brand",
            "People"
        ],
        [
            "want",
            "to",
            "talk",
            "to."
        ]
    ];
    function Qt() {
        let t = 0;
        return e.jsxs("h1", {
            className: "hero-wordreveal",
            style: {
                fontFamily: "var(--font-stack-heading)",
                fontSize: "3.4vw",
                fontWeight: 300,
                lineHeight: 1.1,
                color: "#0a0a0a",
                margin: 0,
                letterSpacing: "-0.01em"
            },
            children: [
                Jt.map((r, i)=>e.jsx("div", {
                        style: {
                            display: "block",
                            overflow: "hidden",
                            position: "relative"
                        },
                        children: r.map((a, o)=>{
                            const n = t++ * .06 + .1;
                            return e.jsxs(We.Fragment, {
                                children: [
                                    e.jsx(x.span, {
                                        style: {
                                            display: "inline-block",
                                            position: "relative",
                                            top: "-0.1em",
                                            transformOrigin: "bottom left"
                                        },
                                        initial: {
                                            y: "1.5em",
                                            rotate: 12
                                        },
                                        animate: {
                                            y: 0,
                                            rotate: 0
                                        },
                                        transition: {
                                            duration: .85,
                                            delay: n,
                                            ease: [
                                                .22,
                                                1,
                                                .36,
                                                1
                                            ]
                                        },
                                        children: a
                                    }),
                                    o < r.length - 1 && e.jsx("span", {
                                        style: {
                                            display: "inline-block",
                                            width: "0.28em"
                                        }
                                    })
                                ]
                            }, o);
                        })
                    }, i)),
                e.jsx("style", {
                    children: `
        @media (max-width: 1280px) { .hero-wordreveal { font-size: 4.2vw !important; } }
        @media (max-width: 1024px) { .hero-wordreveal { font-size: 5.2vw !important; } }
        @media (max-width: 812px)  { .hero-wordreveal { font-size: 7vw !important; } }
        @media (max-width: 480px)  { .hero-wordreveal { font-size: 8.5vw !important; } }
        @media (min-aspect-ratio: 21/9) { .hero-wordreveal { font-size: 2.6vw !important; } }
      `
                })
            ]
        });
    }
    function Fe({ variant: t, children: r, onClick: i }) {
        const a = t === "primary", [o, n] = We.useState(!1);
        return e.jsx("button", {
            onClick: i,
            onMouseEnter: ()=>n(!0),
            onMouseLeave: ()=>n(!1),
            className: "inline-flex items-center cursor-pointer",
            style: {
                fontFamily: "var(--font-stack-heading)",
                fontSize: "clamp(0.6rem, 1.1vw, 0.68rem)",
                fontWeight: 400,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                padding: "10px 24px",
                borderRadius: 999,
                border: `1.5px solid ${a ? "#0a0a0a" : "rgba(10,10,10,0.25)"}`,
                background: a ? o ? "#a46cfc" : "#0a0a0a" : o ? "rgba(10,10,10,0.06)" : "transparent",
                color: a ? "#ffffff" : "#0a0a0a",
                transition: "background 0.22s ease, border-color 0.22s ease"
            },
            children: r
        });
    }
    function ea() {
        const [t, r] = s.useState(!1), [i, a] = s.useState(!1);
        return e.jsxs("div", {
            style: {
                display: "flex",
                flexDirection: "column",
                gap: "clamp(14px, 2.5vh, 24px)"
            },
            children: [
                e.jsx(Qt, {}),
                e.jsxs(x.div, {
                    style: {
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 10
                    },
                    initial: {
                        opacity: 0,
                        y: 8
                    },
                    animate: {
                        opacity: 1,
                        y: 0
                    },
                    transition: {
                        duration: .6,
                        delay: .85,
                        ease: [
                            .22,
                            1,
                            .36,
                            1
                        ]
                    },
                    children: [
                        e.jsx(Fe, {
                            variant: "primary",
                            onClick: ()=>r(!0),
                            children: "Hear Our Story"
                        }),
                        e.jsx(Fe, {
                            variant: "outline",
                            onClick: ()=>a(!0),
                            children: "Meet the Founder"
                        })
                    ]
                }),
                e.jsx(Le, {
                    isOpen: t,
                    onClose: ()=>r(!1),
                    title: "Hear Our Story",
                    videoUrl: "https://ik.imagekit.io/qcvroy8xpd/WhatsApp%20Video%202026-03-03%20at%2019.21.41.mp4"
                }),
                e.jsx(Le, {
                    isOpen: i,
                    onClose: ()=>a(!1)
                })
            ]
        });
    }
    const ta = 768;
    function me() {
        return typeof window > "u" ? !1 : window.innerWidth < ta || "ontouchstart" in window;
    }
    we = function() {
        const [t, r] = s.useState(me);
        return s.useEffect(()=>{
            let i = 0;
            const a = ()=>{
                clearTimeout(i), i = window.setTimeout(()=>r(me()), 150);
            };
            return window.addEventListener("resize", a, {
                passive: !0
            }), ()=>{
                window.removeEventListener("resize", a), clearTimeout(i);
            };
        }, []), t;
    };
    aa = ()=>me();
    function ra({ children: t, width: r = "100%", className: i = "", delay: a = 0 }) {
        const o = s.useRef(null), n = qe(o, {
            once: !0,
            amount: .1
        });
        return e.jsx("div", {
            ref: o,
            style: {
                width: r
            },
            className: i,
            children: e.jsx(x.div, {
                initial: {
                    opacity: 0,
                    y: 75,
                    scale: .95
                },
                animate: n ? {
                    opacity: 1,
                    y: 0,
                    scale: 1
                } : {
                    opacity: 0,
                    y: 75,
                    scale: .95
                },
                transition: {
                    duration: .9,
                    delay: a,
                    ease: [
                        .25,
                        .4,
                        .25,
                        1
                    ]
                },
                style: {
                    willChange: n ? "auto" : "opacity, transform"
                },
                children: t
            })
        });
    }
    function oa({ children: t, className: r = "" }) {
        const i = s.useRef(null), { scrollYProgress: a } = he({
            target: i,
            offset: [
                "start end",
                "end start"
            ]
        }), o = ae(a, [
            0,
            1
        ], [
            100,
            -100
        ]);
        return e.jsx("div", {
            ref: i,
            className: `${r} overflow-hidden`,
            children: e.jsx(x.div, {
                style: {
                    y: o
                },
                className: "w-full",
                children: t
            })
        });
    }
    function na({ children: t, className: r = "" }) {
        const i = s.useRef(null), { scrollYProgress: a } = he({
            target: i,
            offset: [
                "start end",
                "end start"
            ]
        }), o = ae(a, [
            0,
            .3
        ], [
            15,
            0
        ]);
        return e.jsx("div", {
            ref: i,
            className: `${r} perspective-1000`,
            children: e.jsx(x.div, {
                style: {
                    rotateX: o,
                    transformStyle: "preserve-3d"
                },
                initial: {
                    opacity: 0
                },
                whileInView: {
                    opacity: 1
                },
                transition: {
                    duration: .8
                },
                children: t
            })
        });
    }
    const ia = ({ mode: t = "blur", ...r })=>{
        const a = we() ? "blur" : t;
        return a === "parallax" ? e.jsx(oa, {
            ...r
        }) : a === "3d" ? e.jsx(na, {
            ...r
        }) : e.jsx(ra, {
            ...r
        });
    }, sa = s.lazy(()=>J(()=>import("./GlobeWrapper-DPsWe_bE.js").then(async (m)=>{
                await m.__tla;
                return m;
            }), __vite__mapDeps([0,1,2,3,4])).then((t)=>({
                default: t.GlobeWrapper
            }))), ke = [
        {
            subtitle: "The World Is Connected",
            title: `But connection
is not enough.`,
            description: "At H2H, we help companies show up online with a voice that feels real, relatable, and worth listening to.",
            range: [
                0,
                .1,
                .22,
                .28
            ]
        },
        {
            subtitle: "The Digital Era",
            title: `Brands went
digital. Fast.`,
            description: "In today's crowded digital world, connection is currency. Your audience wants honesty, personality, and purpose.",
            range: [
                .22,
                .32,
                .45,
                .52
            ]
        },
        {
            subtitle: "The AI Era",
            title: `More content.
Less connection.`,
            description: "We help you deliver all three — through strategy, storytelling, and content that actually resonates.",
            range: [
                .48,
                .56,
                .68,
                .76
            ]
        },
        {
            subtitle: "The H2H Difference",
            title: `Human to
Human.`,
            description: "Whether you're a startup or a global brand, we'll help you cut through the noise and build a social presence that connects on a human level.",
            range: [
                .72,
                .8,
                1,
                1
            ]
        }
    ], la = ke.map((t, r)=>({
            fontFamily: "var(--font-stack-heading)",
            textShadow: `0 0 50px rgba(168,85,247,${.4 + r * .15})`,
            whiteSpace: "pre-line"
        })), ca = {
        color: "rgba(209,213,219,0.9)"
    }, da = s.memo(({ scrollYProgress: t, phaseIndex: r })=>{
        const i = ke[r], a = i.range, o = ae(t, a, [
            0,
            1,
            1,
            0
        ]), n = ae(t, a, [
            40,
            0,
            0,
            -40
        ]);
        return e.jsxs(x.div, {
            className: "absolute inset-0 flex flex-col justify-center",
            style: {
                opacity: o,
                y: n,
                willChange: "transform, opacity"
            },
            children: [
                e.jsx("h2", {
                    className: "text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-tight mb-4 sm:mb-6 text-white",
                    style: la[r],
                    children: i.title
                }),
                e.jsx("p", {
                    className: "text-sm sm:text-base md:text-lg leading-relaxed max-w-sm",
                    style: ca,
                    children: i.description
                })
            ]
        });
    }), pa = {
        background: "rgba(168,85,247,0.2)"
    }, ua = "linear-gradient(to right, rgba(168,85,247,0.9), rgba(192,132,252,0.5))", ma = {
        width: 6,
        height: 6,
        borderRadius: "50%",
        background: "#c084fc",
        boxShadow: "0 0 8px rgba(192,132,252,0.8)",
        translateX: "-50%"
    }, ha = {
        color: "rgba(192,132,252,0.75)",
        fontFamily: "var(--font-stack-heading)"
    }, ga = s.memo(({ progressBarWidth: t })=>e.jsxs("div", {
            className: "absolute bottom-6 left-4 md:left-8 lg:left-12 right-4 md:right-8 z-20 hidden md:flex flex-col gap-2",
            children: [
                e.jsxs("div", {
                    className: "w-64 h-px relative",
                    style: pa,
                    children: [
                        e.jsx(x.div, {
                            className: "absolute inset-y-0 left-0",
                            style: {
                                width: t,
                                background: ua
                            }
                        }),
                        e.jsx(x.div, {
                            className: "absolute top-1/2 -translate-y-1/2",
                            style: {
                                left: t,
                                ...ma
                            }
                        })
                    ]
                }),
                e.jsxs("div", {
                    className: "flex items-center gap-2",
                    children: [
                        e.jsx("svg", {
                            width: "14",
                            height: "8",
                            viewBox: "0 0 14 8",
                            fill: "none",
                            children: e.jsx("path", {
                                d: "M0 4H12M12 4L8 1M12 4L8 7",
                                stroke: "rgba(192,132,252,0.75)",
                                strokeWidth: "1",
                                strokeLinecap: "round"
                            })
                        }),
                        e.jsx("span", {
                            className: "text-xs uppercase tracking-[0.2em]",
                            style: ha,
                            children: "scroll to explore"
                        })
                    ]
                })
            ]
        })), xa = {
        background: "radial-gradient(ellipse at 50% 40%, rgba(88,28,135,0.35) 0%, rgba(59,7,100,0.25) 40%, rgba(30,0,60,0.2) 70%, transparent 100%)"
    }, fa = {
        background: "linear-gradient(to right, rgba(2,0,8,0.75) 0%, rgba(2,0,8,0.4) 35%, transparent 60%)"
    }, ya = {
        background: "linear-gradient(to top, rgba(2,0,8,0.95) 0%, rgba(2,0,8,0.8) 25%, rgba(2,0,8,0.5) 45%, rgba(2,0,8,0.15) 65%, transparent 80%)"
    }, va = {
        background: "linear-gradient(to top, rgba(2,0,8,0.6) 0%, transparent 100%)"
    }, ba = {
        background: "radial-gradient(ellipse at 60% 50%, #1a0a35 0%, #0e0422 40%, #080118 100%)"
    };
    function wa() {
        const t = s.useRef(null), r = s.useRef(null), [i, a] = s.useState(!1), [o, n] = s.useState(!1), m = we(), { scrollYProgress: l } = he({
            target: t,
            offset: [
                "start start",
                "end end"
            ]
        }), v = ae(l, [
            0,
            1
        ], [
            "0%",
            "100%"
        ]);
        return s.useEffect(()=>{
            const b = r.current;
            if (!b) return;
            const p = new IntersectionObserver(([y])=>{
                const u = y.isIntersecting;
                a(u), u && n(!0);
            }, {
                threshold: 0,
                rootMargin: "400px 0px"
            });
            return p.observe(b), ()=>p.disconnect();
        }, []), e.jsx("div", {
            ref: t,
            className: "relative w-full",
            style: {
                height: "500vh"
            },
            children: e.jsxs("div", {
                ref: r,
                className: "sticky top-0 h-screen w-full overflow-hidden",
                style: ba,
                children: [
                    o && e.jsx(s.Suspense, {
                        fallback: null,
                        children: e.jsx(sa, {
                            scrollYProgress: l,
                            isVisible: i
                        })
                    }),
                    e.jsx("div", {
                        className: "absolute inset-0 pointer-events-none",
                        style: xa
                    }),
                    e.jsx("div", {
                        className: "absolute inset-0 pointer-events-none",
                        style: m ? ya : fa
                    }),
                    e.jsx("div", {
                        className: `relative z-10 h-full flex ${m ? "items-start pt-[38vh]" : "items-center"}`,
                        children: e.jsx("div", {
                            className: "w-full max-w-8xl mx-auto px-4 md:px-8 lg:px-12",
                            children: e.jsx("div", {
                                className: "w-full md:w-1/2 relative",
                                style: {
                                    minHeight: m ? 160 : 200
                                },
                                children: ke.map((b, p)=>e.jsx(da, {
                                        scrollYProgress: l,
                                        phaseIndex: p
                                    }, p))
                            })
                        })
                    }),
                    e.jsx(ga, {
                        progressBarWidth: v
                    }),
                    e.jsx("div", {
                        className: "absolute bottom-0 left-0 right-0 h-32 pointer-events-none",
                        style: va
                    })
                ]
            })
        });
    }
    const ka = [
        {
            label: "LinkedIn",
            icon: At,
            href: "https://www.linkedin.com/company/human2humanmarketing/"
        },
        {
            label: "Twitter",
            icon: $t,
            href: "#"
        },
        {
            label: "Instagram",
            icon: zt,
            href: "#"
        }
    ], de = {
        hidden: {
            opacity: 0,
            y: 24
        },
        visible: (t)=>({
                opacity: 1,
                y: 0,
                transition: {
                    duration: .5,
                    delay: t * .15,
                    ease: [
                        .22,
                        1,
                        .36,
                        1
                    ]
                }
            })
    };
    function je() {
        return e.jsxs("footer", {
            className: "bg-[var(--color-background-light)] relative",
            style: {
                padding: "clamp(32px, 8vw, 128px) 0 var(--space-8x)"
            },
            children: [
                e.jsx("div", {
                    className: "absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[var(--color-secondary)]/30 to-transparent"
                }),
                e.jsx("div", {
                    className: "container",
                    style: {
                        padding: "0 var(--space-4x)"
                    },
                    children: e.jsxs("div", {
                        className: "max-w-7xl mx-auto",
                        children: [
                            e.jsxs("div", {
                                className: "grid md:grid-cols-3",
                                style: {
                                    gap: "clamp(24px, 6vw, 128px)",
                                    marginBottom: "clamp(32px, 6vw, 128px)"
                                },
                                children: [
                                    e.jsxs(x.div, {
                                        variants: de,
                                        initial: "hidden",
                                        whileInView: "visible",
                                        viewport: {
                                            once: !0,
                                            margin: "-40px"
                                        },
                                        custom: 0,
                                        children: [
                                            e.jsx("div", {
                                                style: {
                                                    marginBottom: "var(--space-6x)"
                                                },
                                                children: e.jsx(xe, {
                                                    height: 48
                                                })
                                            }),
                                            e.jsx("p", {
                                                className: "text-[var(--color-text-dark)]/75 text-sm max-w-xs",
                                                style: {
                                                    lineHeight: "var(--line-height-relaxed)"
                                                },
                                                children: "Transforming businesses across Africa through award-winning digital innovation."
                                            })
                                        ]
                                    }),
                                    e.jsxs(x.div, {
                                        variants: de,
                                        initial: "hidden",
                                        whileInView: "visible",
                                        viewport: {
                                            once: !0,
                                            margin: "-40px"
                                        },
                                        custom: 1,
                                        children: [
                                            e.jsx("p", {
                                                className: "text-xs tracking-[0.2em] text-[var(--color-text-dark)]/60",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    marginBottom: "var(--space-6x)"
                                                },
                                                children: "CONNECT"
                                            }),
                                            e.jsx("div", {
                                                className: "space-y-4",
                                                children: ka.map((t)=>e.jsxs("a", {
                                                        href: t.href,
                                                        className: "group flex items-center gap-3 text-[var(--color-text-dark)]/80 hover:text-[var(--color-secondary)] transition-colors duration-300",
                                                        style: {
                                                            lineHeight: "var(--line-height-normal)"
                                                        },
                                                        children: [
                                                            e.jsx(t.icon, {
                                                                className: "w-4 h-4 opacity-60 group-hover:opacity-100 transition-opacity duration-300"
                                                            }),
                                                            e.jsxs("span", {
                                                                className: "relative",
                                                                children: [
                                                                    t.label,
                                                                    e.jsx("span", {
                                                                        className: "absolute left-0 -bottom-0.5 w-full h-px bg-[var(--color-secondary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                                                    })
                                                                ]
                                                            })
                                                        ]
                                                    }, t.label))
                                            })
                                        ]
                                    }),
                                    e.jsxs(x.div, {
                                        variants: de,
                                        initial: "hidden",
                                        whileInView: "visible",
                                        viewport: {
                                            once: !0,
                                            margin: "-40px"
                                        },
                                        custom: 2,
                                        children: [
                                            e.jsx("p", {
                                                className: "text-xs tracking-[0.2em] text-[var(--color-text-dark)]/60",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    marginBottom: "var(--space-6x)"
                                                },
                                                children: "CONTACT"
                                            }),
                                            e.jsx("a", {
                                                href: "mailto:shannon@h2hsocial.club",
                                                className: "group block text-[var(--color-text-dark)]/80 hover:text-[var(--color-secondary)] transition-colors duration-300",
                                                style: {
                                                    lineHeight: "var(--line-height-normal)",
                                                    marginBottom: "var(--space-2x)"
                                                },
                                                children: e.jsxs("span", {
                                                    className: "relative",
                                                    children: [
                                                        "shannon@h2hsocial.club",
                                                        e.jsx("span", {
                                                            className: "absolute left-0 -bottom-0.5 w-full h-px bg-[var(--color-secondary)] origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"
                                                        })
                                                    ]
                                                })
                                            })
                                        ]
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                className: "border-t border-[var(--color-text-dark)]/10 flex flex-wrap justify-between items-center gap-3 sm:gap-4",
                                style: {
                                    paddingTop: "clamp(16px, 4vw, 64px)"
                                },
                                children: [
                                    e.jsx("p", {
                                        className: "text-[var(--color-text-dark)]/60 text-xs tracking-widest",
                                        style: {
                                            fontFamily: "var(--font-stack-heading)"
                                        },
                                        children: "© 2026 H2H SOCIAL"
                                    }),
                                    e.jsxs("div", {
                                        className: "flex items-center",
                                        style: {
                                            gap: "clamp(16px, 4vw, 64px)"
                                        },
                                        children: [
                                            e.jsx(Me, {
                                                to: "/privacy",
                                                className: "text-[var(--color-text-dark)]/60 text-xs tracking-widest hover:text-[var(--color-text-dark)]/90 transition-colors duration-300",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: "PRIVACY"
                                            }),
                                            e.jsx(Me, {
                                                to: "/terms",
                                                className: "text-[var(--color-text-dark)]/60 text-xs tracking-widest hover:text-[var(--color-text-dark)]/90 transition-colors duration-300",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: "TERMS"
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                })
            ]
        });
    }
    function ja() {
        const t = s.useRef(null);
        return s.useEffect(()=>{
            const r = t.current;
            if (!r) return;
            const i = aa(), a = r.clientWidth, o = r.clientHeight, n = new $e({
                antialias: !i,
                alpha: !0,
                powerPreference: i ? "low-power" : "default"
            });
            n.setPixelRatio(i ? 1 : Math.min(window.devicePixelRatio, 2)), n.setSize(a, o), n.shadowMap.enabled = !i, r.appendChild(n.domElement);
            const m = new Ye, l = new Ve(45, a / o, .1, 100);
            l.position.set(0, 0, 5.5);
            const v = new Ue(16777215, .6);
            m.add(v);
            const b = new le(16777215, 1.2);
            b.position.set(3, 5, 4), b.castShadow = !0, m.add(b);
            const p = new le(8965375, .5);
            p.position.set(-3, -2, 3), m.add(p);
            const y = new le(16765088, .4);
            y.position.set(0, -4, -3), m.add(y);
            const u = new Xe;
            m.add(u);
            const h = new Q(1.4, 2.8, .14), w = new ee({
                color: 1118481,
                metalness: .6,
                roughness: .2,
                clearcoat: .8,
                clearcoatRoughness: .1
            }), g = new Y(h, w);
            g.castShadow = !0, u.add(g);
            const S = new Ke(1.15, 2.45), k = document.createElement("canvas");
            k.width = 256, k.height = 512;
            const f = k.getContext("2d"), I = f.createLinearGradient(0, 0, 256, 512);
            I.addColorStop(0, "#0a0a1a"), I.addColorStop(.4, "#0d1b3e"), I.addColorStop(1, "#0a1a0d"), f.fillStyle = I, f.fillRect(0, 0, 256, 512), f.fillStyle = "rgba(255,255,255,0.08)", f.beginPath(), f.arc(128, 128, 80, 0, Math.PI * 2), f.fill(), f.fillStyle = "rgba(255,255,255,0.05)", f.beginPath(), f.arc(128, 320, 60, 0, Math.PI * 2), f.fill(), f.fillStyle = "rgba(100,200,255,0.6)", f.font = "bold 18px Arial", f.textAlign = "center", f.fillText("CONNECT", 128, 200);
            const L = (T, N, F, A, H)=>{
                f.beginPath(), f.moveTo(T + H, N), f.lineTo(T + F - H, N), f.quadraticCurveTo(T + F, N, T + F, N + H), f.lineTo(T + F, N + A - H), f.quadraticCurveTo(T + F, N + A, T + F - H, N + A), f.lineTo(T + H, N + A), f.quadraticCurveTo(T, N + A, T, N + A - H), f.lineTo(T, N + H), f.quadraticCurveTo(T, N, T + H, N), f.closePath(), f.fill();
            };
            f.fillStyle = "rgba(255,255,255,0.15)", L(50, 280, 156, 40, 8), f.fillStyle = "rgba(255,255,255,0.6)", f.font = "14px Arial", f.fillText("Get in Touch", 128, 306);
            const j = new Ze(k), c = new Ne({
                map: j
            }), d = new Y(S, c);
            d.position.z = .075, u.add(d);
            const M = new Q(.35, .07, .02), P = new ee({
                color: 328965,
                metalness: .5,
                roughness: .3
            }), O = new Y(M, P);
            O.position.set(0, 1.34, .075), u.add(O);
            const D = new Q(.4, .04, .01), G = new Y(D, new ee({
                color: 5592405,
                metalness: .3,
                roughness: .5
            }));
            G.position.set(0, -1.3, .076), u.add(G);
            const C = new ee({
                color: 2236962,
                metalness: .7,
                roughness: .2
            }), R = new Q(.04, .3, .08), W = new Y(R, C);
            W.position.set(-.72, .6, 0), u.add(W);
            const V = W.clone();
            V.position.set(-.72, .2, 0), u.add(V);
            const se = new Q(.04, .4, .1), U = new Y(se, C);
            U.position.set(.72, .3, 0), u.add(U);
            const X = [];
            for(let T = 0; T < 3; T++){
                const N = new Je(.3 + T * .25, .015, 8, 40), F = new Ne({
                    color: new Qe().setHSL(.55 + T * .05, .9, .6),
                    transparent: !0,
                    opacity: .6 - T * .15
                }), A = new Y(N, F);
                A.position.set(.8, 1.2, .3), A.rotation.x = Math.PI / 4, m.add(A), X.push(A);
            }
            const B = [];
            [
                16729190,
                4521898,
                16755268
            ].forEach((T, N)=>{
                const F = new et(.06, 12, 12), A = new ee({
                    color: T,
                    emissive: T,
                    emissiveIntensity: .5,
                    metalness: .3,
                    roughness: .3
                }), H = new Y(F, A);
                H.position.set(-.55 + N * .55, -.9, .12), u.add(H), B.push(H);
            });
            let E = 0;
            const K = new tt;
            let $ = 0, Z = !1;
            function Se() {
                if ($ = requestAnimationFrame(Se), !Z) return;
                const T = K.getDelta();
                E += T, u.rotation.y = Math.sin(E * .8) * .35, u.rotation.x = Math.sin(E * .5) * .12, u.rotation.z = Math.sin(E * .6) * .08, u.position.y = Math.sin(E * 1.2) * .15, u.position.x = Math.sin(E * .7) * .08, X.forEach((N, F)=>{
                    const A = 1 + Math.sin(E * 2 + F * .8) * .3;
                    N.scale.setScalar(A), N.material.opacity = Math.max(0, .5 - F * .1 + Math.sin(E * 2 + F) * .2), N.rotation.z = E * .5 + F * Math.PI / 3;
                }), B.forEach((N, F)=>{
                    N.position.y = -.9 + Math.sin(E * 2 + F * 1.2) * .05, N.material.emissiveIntensity = .4 + Math.sin(E * 3 + F) * .3;
                }), n.render(m, l);
            }
            const Ie = new IntersectionObserver(([T])=>{
                Z = T.isIntersecting, Z && K.getDelta();
            }, {
                threshold: .05
            });
            Ie.observe(r), Se();
            const Te = ()=>{
                if (!r) return;
                const T = r.clientWidth, N = r.clientHeight;
                l.aspect = T / N, l.updateProjectionMatrix(), n.setSize(T, N);
            };
            return window.addEventListener("resize", Te, {
                passive: !0
            }), ()=>{
                cancelAnimationFrame($), Ie.disconnect(), window.removeEventListener("resize", Te), n.dispose(), r.contains(n.domElement) && r.removeChild(n.domElement);
            };
        }, []), e.jsx("div", {
            ref: t,
            style: {
                width: "100%",
                height: "100%",
                position: "absolute",
                inset: 0
            }
        });
    }
    function Sa() {
        const [t, r] = s.useState({
            name: "",
            email: "",
            message: ""
        }), [i, a] = s.useState("idle"), o = s.useRef(null);
        s.useEffect(()=>()=>{
                o.current && clearTimeout(o.current);
            }, []);
        const n = async (l)=>{
            l.preventDefault(), a("submitting"), await new Promise((v)=>setTimeout(v, 2e3)), a("success"), o.current = setTimeout(()=>{
                r({
                    name: "",
                    email: "",
                    message: ""
                }), a("idle");
            }, 3e3);
        }, m = (l)=>{
            r({
                ...t,
                [l.target.name]: l.target.value
            });
        };
        return e.jsxs("section", {
            style: {
                background: "var(--color-background-light)",
                borderTop: "3px solid var(--color-text-dark)",
                position: "relative",
                overflow: "visible"
            },
            children: [
                e.jsxs("div", {
                    style: {
                        maxWidth: "1280px",
                        margin: "0 auto",
                        padding: "clamp(40px, 8vw, 120px) clamp(20px, 5vw, 60px)",
                        position: "relative",
                        zIndex: 1,
                        display: "grid",
                        gridTemplateColumns: "1fr 1fr",
                        gap: "clamp(24px, 6vw, 80px)",
                        alignItems: "start"
                    },
                    className: "contact-grid",
                    children: [
                        e.jsx(x.div, {
                            initial: {
                                opacity: 0,
                                x: -40
                            },
                            whileInView: {
                                opacity: 1,
                                x: 0
                            },
                            viewport: {
                                once: !0
                            },
                            transition: {
                                duration: .7,
                                ease: "easeOut"
                            },
                            style: {
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center"
                            },
                            children: e.jsx("div", {
                                className: "contact-phone-box",
                                style: {
                                    width: "100%",
                                    aspectRatio: "3 / 4",
                                    position: "relative",
                                    border: "3px solid var(--color-text-dark)",
                                    borderRadius: 16,
                                    boxShadow: "8px 8px 0 var(--color-surface-dark)",
                                    background: "linear-gradient(135deg, #0a0a1a 0%, #0d1b3e 50%, #0a1a0d 100%)",
                                    overflow: "hidden"
                                },
                                children: e.jsx(ja, {})
                            })
                        }),
                        e.jsxs(x.div, {
                            initial: {
                                opacity: 0,
                                x: 40
                            },
                            whileInView: {
                                opacity: 1,
                                x: 0
                            },
                            viewport: {
                                once: !0
                            },
                            transition: {
                                duration: .7,
                                ease: "easeOut",
                                delay: .15
                            },
                            style: {
                                border: "3px solid var(--color-text-dark)",
                                borderRadius: 16,
                                padding: "clamp(24px, 4vw, 52px)",
                                background: "var(--color-background-light)",
                                boxShadow: "8px 8px 0 var(--color-surface-dark)",
                                position: "relative"
                            },
                            children: [
                                e.jsxs("div", {
                                    style: {
                                        marginBottom: "36px"
                                    },
                                    children: [
                                        e.jsx("h2", {
                                            style: {
                                                fontSize: "clamp(2rem, 3.5vw, 3rem)",
                                                fontWeight: 700,
                                                color: "var(--color-text-dark)",
                                                marginBottom: "12px",
                                                letterSpacing: "-0.02em",
                                                lineHeight: 1.2,
                                                fontFamily: "var(--font-stack-heading)"
                                            },
                                            children: "Let's Build Your Company's Communication Strategy, That Feels Human"
                                        }),
                                        e.jsx("p", {
                                            style: {
                                                fontSize: "0.875rem",
                                                color: "var(--color-text-dark)",
                                                opacity: .5,
                                                lineHeight: 1.6,
                                                fontFamily: "var(--font-stack-heading)"
                                            },
                                            children: "We'd love to hear more about your brand, your goals, and how we can help you connect more meaningfully with your audience."
                                        })
                                    ]
                                }),
                                e.jsx(ne, {
                                    mode: "wait",
                                    children: i === "success" ? e.jsxs(x.div, {
                                        initial: {
                                            opacity: 0,
                                            scale: .9
                                        },
                                        animate: {
                                            opacity: 1,
                                            scale: 1
                                        },
                                        exit: {
                                            opacity: 0
                                        },
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            padding: "60px 20px",
                                            textAlign: "center",
                                            gap: "16px"
                                        },
                                        children: [
                                            e.jsx("div", {
                                                style: {
                                                    width: "64px",
                                                    height: "64px",
                                                    border: "3px solid var(--color-text-dark)",
                                                    borderRadius: 12,
                                                    boxShadow: "4px 4px 0 var(--color-surface-dark)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    fontSize: "28px",
                                                    color: "var(--color-text-dark)",
                                                    fontWeight: 800
                                                },
                                                children: "✓"
                                            }),
                                            e.jsx("div", {
                                                style: {
                                                    color: "var(--color-text-dark)",
                                                    fontSize: "1.25rem",
                                                    fontWeight: 700,
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: "Message Sent!"
                                            }),
                                            e.jsx("div", {
                                                style: {
                                                    color: "var(--color-text-dark)",
                                                    opacity: .75,
                                                    fontSize: "0.875rem",
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: "We'll be in touch shortly."
                                            })
                                        ]
                                    }, "success") : e.jsxs(x.form, {
                                        onSubmit: n,
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "20px"
                                        },
                                        initial: {
                                            opacity: 0
                                        },
                                        animate: {
                                            opacity: 1
                                        },
                                        exit: {
                                            opacity: 0
                                        },
                                        children: [
                                            [
                                                {
                                                    name: "name",
                                                    label: "Your Name",
                                                    type: "text",
                                                    icon: be,
                                                    placeholder: "Jane Smith"
                                                },
                                                {
                                                    name: "email",
                                                    label: "Email Address",
                                                    type: "email",
                                                    icon: Bt,
                                                    placeholder: "jane@company.com"
                                                }
                                            ].map((l)=>e.jsxs("div", {
                                                    children: [
                                                        e.jsx("label", {
                                                            style: {
                                                                display: "block",
                                                                fontSize: "0.7rem",
                                                                fontWeight: 700,
                                                                color: "var(--color-text-dark)",
                                                                marginBottom: "8px",
                                                                letterSpacing: "0.1em",
                                                                textTransform: "uppercase",
                                                                fontFamily: "var(--font-stack-heading)"
                                                            },
                                                            children: l.label
                                                        }),
                                                        e.jsxs("div", {
                                                            style: {
                                                                position: "relative",
                                                                display: "flex",
                                                                alignItems: "center"
                                                            },
                                                            children: [
                                                                e.jsx(l.icon, {
                                                                    size: 15,
                                                                    style: {
                                                                        position: "absolute",
                                                                        left: "13px",
                                                                        color: "var(--color-text-dark)",
                                                                        opacity: .6,
                                                                        pointerEvents: "none"
                                                                    }
                                                                }),
                                                                e.jsx("input", {
                                                                    type: l.type,
                                                                    name: l.name,
                                                                    required: !0,
                                                                    value: t[l.name],
                                                                    onChange: m,
                                                                    placeholder: l.placeholder,
                                                                    style: {
                                                                        width: "100%",
                                                                        background: "var(--color-background-light)",
                                                                        border: "3px solid var(--color-text-dark)",
                                                                        borderRadius: 8,
                                                                        padding: "13px 16px 13px 40px",
                                                                        color: "var(--color-text-dark)",
                                                                        fontSize: "0.9rem",
                                                                        outline: "none",
                                                                        transition: "box-shadow 0.2s",
                                                                        fontFamily: "var(--font-stack-heading)",
                                                                        boxShadow: "4px 4px 0 var(--color-surface-dark)"
                                                                    },
                                                                    onFocus: (v)=>{
                                                                        v.currentTarget.style.boxShadow = "6px 6px 0 var(--color-text-dark)";
                                                                    },
                                                                    onBlur: (v)=>{
                                                                        v.currentTarget.style.boxShadow = "4px 4px 0 var(--color-surface-dark)";
                                                                    }
                                                                })
                                                            ]
                                                        })
                                                    ]
                                                }, l.name)),
                                            e.jsxs("div", {
                                                children: [
                                                    e.jsx("label", {
                                                        style: {
                                                            display: "block",
                                                            fontSize: "0.7rem",
                                                            fontWeight: 700,
                                                            color: "var(--color-text-dark)",
                                                            marginBottom: "8px",
                                                            letterSpacing: "0.1em",
                                                            textTransform: "uppercase",
                                                            fontFamily: "var(--font-stack-heading)"
                                                        },
                                                        children: "Message"
                                                    }),
                                                    e.jsxs("div", {
                                                        style: {
                                                            position: "relative"
                                                        },
                                                        children: [
                                                            e.jsx(Wt, {
                                                                size: 15,
                                                                style: {
                                                                    position: "absolute",
                                                                    left: "13px",
                                                                    top: "15px",
                                                                    color: "var(--color-text-dark)",
                                                                    opacity: .6,
                                                                    pointerEvents: "none"
                                                                }
                                                            }),
                                                            e.jsx("textarea", {
                                                                name: "message",
                                                                required: !0,
                                                                rows: 5,
                                                                value: t.message,
                                                                onChange: m,
                                                                placeholder: "Tell us about your project, goals, and timeline...",
                                                                style: {
                                                                    width: "100%",
                                                                    background: "var(--color-background-light)",
                                                                    border: "3px solid var(--color-text-dark)",
                                                                    borderRadius: 0,
                                                                    padding: "13px 16px 13px 40px",
                                                                    color: "var(--color-text-dark)",
                                                                    fontSize: "0.9rem",
                                                                    outline: "none",
                                                                    resize: "none",
                                                                    transition: "box-shadow 0.2s",
                                                                    fontFamily: "inherit",
                                                                    boxShadow: "4px 4px 0 var(--color-surface-dark)"
                                                                },
                                                                onFocus: (l)=>{
                                                                    l.currentTarget.style.boxShadow = "6px 6px 0 var(--color-text-dark)";
                                                                },
                                                                onBlur: (l)=>{
                                                                    l.currentTarget.style.boxShadow = "4px 4px 0 var(--color-surface-dark)";
                                                                }
                                                            })
                                                        ]
                                                    })
                                                ]
                                            }),
                                            e.jsxs(x.button, {
                                                type: "submit",
                                                disabled: i !== "idle",
                                                whileHover: {
                                                    x: i === "idle" ? -2 : 0,
                                                    y: i === "idle" ? -2 : 0
                                                },
                                                whileTap: {
                                                    x: 0,
                                                    y: 0
                                                },
                                                style: {
                                                    width: "100%",
                                                    padding: "16px 24px",
                                                    background: "var(--color-text-dark)",
                                                    border: "3px solid var(--color-text-dark)",
                                                    borderRadius: 0,
                                                    color: "var(--color-background-light)",
                                                    fontSize: "0.8rem",
                                                    fontWeight: 700,
                                                    letterSpacing: "0.12em",
                                                    textTransform: "uppercase",
                                                    cursor: i !== "idle" ? "not-allowed" : "pointer",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "10px",
                                                    opacity: i !== "idle" ? .6 : 1,
                                                    boxShadow: "6px 6px 0 var(--color-surface-dark)",
                                                    transition: "box-shadow 0.2s, transform 0.2s, opacity 0.2s",
                                                    marginTop: "4px",
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                onMouseEnter: (l)=>{
                                                    i === "idle" && (l.currentTarget.style.boxShadow = "8px 8px 0 var(--color-surface-dark)");
                                                },
                                                onMouseLeave: (l)=>{
                                                    l.currentTarget.style.boxShadow = "6px 6px 0 var(--color-surface-dark)";
                                                },
                                                children: [
                                                    i === "idle" && e.jsxs(e.Fragment, {
                                                        children: [
                                                            e.jsx(Gt, {
                                                                size: 15
                                                            }),
                                                            "Send Message"
                                                        ]
                                                    }),
                                                    i === "submitting" && e.jsx("div", {
                                                        style: {
                                                            width: "20px",
                                                            height: "20px",
                                                            border: "2px solid rgba(255,255,255,0.3)",
                                                            borderTopColor: "var(--color-background-light)",
                                                            borderRadius: "50%",
                                                            animation: "spin 0.7s linear infinite"
                                                        }
                                                    })
                                                ]
                                            }),
                                            e.jsx("p", {
                                                style: {
                                                    textAlign: "center",
                                                    fontSize: "0.75rem",
                                                    color: "var(--color-text-dark)",
                                                    opacity: .6,
                                                    marginTop: "4px",
                                                    fontFamily: "var(--font-stack-heading)",
                                                    letterSpacing: "0.05em"
                                                },
                                                children: "We respond within 24 hours. No spam, ever."
                                            })
                                        ]
                                    }, "form")
                                })
                            ]
                        })
                    ]
                }),
                e.jsx("style", {
                    children: `
        @keyframes spin { to { transform: rotate(360deg); } }
        @media (max-width: 768px) {
          .contact-grid {
            grid-template-columns: 1fr !important;
          }
          .contact-phone-box {
            aspect-ratio: 4 / 3 !important;
            max-height: 320px;
          }
        }
        .contact-grid input::placeholder,
        .contact-grid textarea::placeholder {
          color: var(--color-text-dark);
          opacity: 0.5;
        }
      `
                })
            ]
        });
    }
    const ze = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position, 1.0);
  }
`, Ia = `
  precision highp float;
  uniform sampler2D uPrev;
  uniform vec2 uMouse;
  uniform vec2 uPrevMouse;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec4 prev = texture2D(uPrev, vUv);

    vec2 uv = vUv;
    uv.x *= uAspect;

    vec2 mouse = uMouse;
    mouse.x *= uAspect;

    vec2 pmouse = uPrevMouse;
    pmouse.x *= uAspect;

    vec2 vel = mouse - pmouse;
    float speed = length(vel);

    float radius = 0.08;
    float dist = distance(uv, mouse);
    float strength = smoothstep(radius, 0.0, dist);

    vec2 force = vel * strength * 8.0;
    vec2 color = prev.rg + force;

    color *= 0.965;

    gl_FragColor = vec4(color, 0.0, 1.0);
  }
`, Ta = `
  precision highp float;
  uniform sampler2D uFluid;
  uniform vec2 uMouse;
  uniform float uAspect;
  varying vec2 vUv;

  void main() {
    vec2 fluid = texture2D(uFluid, vUv).rg;
    float len = length(fluid);

    vec2 uv = vUv;
    uv.x *= uAspect;
    vec2 mouse = uMouse;
    mouse.x *= uAspect;

    float dist = distance(uv, mouse);
    float head = smoothstep(0.055, 0.0, dist);

    vec3 trailColor = vec3(0.644, 0.424, 0.988);
    vec3 headColor = vec3(0.486, 0.016, 0.988);

    float trailAlpha = smoothstep(0.0, 0.18, len) * 0.7;
    float headAlpha = head * 0.85;

    float alpha = max(trailAlpha, headAlpha);
    vec3 col = mix(trailColor, headColor, head);

    gl_FragColor = vec4(col * alpha, alpha);
  }
`;
    function Na() {
        const t = s.useRef(null), r = we();
        return s.useEffect(()=>{
            if (r) return;
            const i = t.current;
            if (!i) return;
            let a = window.innerWidth, o = window.innerHeight;
            const n = new z.WebGLRenderer({
                canvas: i,
                alpha: !0,
                antialias: !1
            });
            n.setPixelRatio(1), n.setSize(a, o), n.setClearColor(0, 0), new z.Scene;
            const m = new z.OrthographicCamera(-1, 1, 1, -1, 0, 1), l = new z.PlaneGeometry(2, 2), v = ()=>new z.WebGLRenderTarget(a, o, {
                    minFilter: z.LinearFilter,
                    magFilter: z.LinearFilter,
                    format: z.RGBAFormat,
                    type: z.HalfFloatType
                });
            let b = v(), p = v();
            const y = new z.Vector2(-1, -1), u = new z.Vector2(-1, -1);
            let h = !1;
            const w = new z.ShaderMaterial({
                vertexShader: ze,
                fragmentShader: Ia,
                uniforms: {
                    uPrev: {
                        value: null
                    },
                    uMouse: {
                        value: y
                    },
                    uPrevMouse: {
                        value: u
                    },
                    uAspect: {
                        value: a / o
                    }
                }
            }), g = new z.ShaderMaterial({
                vertexShader: ze,
                fragmentShader: Ta,
                uniforms: {
                    uFluid: {
                        value: null
                    },
                    uMouse: {
                        value: y
                    },
                    uAspect: {
                        value: a / o
                    }
                },
                transparent: !0,
                blending: z.AdditiveBlending,
                depthWrite: !1
            }), S = new z.Mesh(l, w), k = new z.Mesh(l, g), f = new z.Scene;
            f.add(S);
            const I = new z.Scene;
            I.add(k);
            const L = (C)=>{
                u.copy(y), y.set(C.clientX / a, 1 - C.clientY / o), h = !0, P = performance.now();
            }, j = ()=>{
                h = !1;
            }, c = ()=>{
                a = window.innerWidth, o = window.innerHeight, n.setSize(a, o), b.dispose(), p.dispose(), b = v(), p = v(), w.uniforms.uAspect.value = a / o, g.uniforms.uAspect.value = a / o;
            };
            let d, M = document.hidden, P = 0;
            const O = 3e3, D = ()=>{
                if (M) return;
                d = requestAnimationFrame(D);
                const R = performance.now() - P > O;
                if (!h || R) return;
                w.uniforms.uPrev.value = b.texture, w.uniforms.uMouse.value = y, w.uniforms.uPrevMouse.value = u, n.setRenderTarget(p), n.render(f, m), n.setRenderTarget(null);
                const W = b;
                b = p, p = W, g.uniforms.uFluid.value = b.texture, g.uniforms.uMouse.value = y, n.render(I, m), u.copy(y);
            }, G = ()=>{
                M = document.hidden, M || (d = requestAnimationFrame(D));
            };
            return window.addEventListener("mousemove", L, {
                passive: !0
            }), document.addEventListener("mouseleave", j), window.addEventListener("resize", c, {
                passive: !0
            }), document.addEventListener("visibilitychange", G), d = requestAnimationFrame(D), ()=>{
                window.removeEventListener("mousemove", L), document.removeEventListener("mouseleave", j), window.removeEventListener("resize", c), document.removeEventListener("visibilitychange", G), cancelAnimationFrame(d), n.dispose(), b.dispose(), p.dispose();
            };
        }, [
            r
        ]), r ? null : e.jsx("canvas", {
            ref: t,
            style: {
                position: "fixed",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                pointerEvents: "none",
                zIndex: 9999,
                mixBlendMode: "screen"
            }
        });
    }
    const oe = [
        "#a46cfc",
        "#7c3aed",
        "#c084fc",
        "#9333ea"
    ], Ma = (t = 0)=>[
            {
                color: "#444",
                roughness: .1
            },
            {
                color: "#444",
                roughness: .75
            },
            {
                color: "#444",
                roughness: .75
            },
            {
                color: "#1a0a2e",
                roughness: .1
            },
            {
                color: "white",
                roughness: .75
            },
            {
                color: "white",
                roughness: .1
            },
            {
                color: oe[t],
                roughness: .1,
                accent: !0
            },
            {
                color: oe[t],
                roughness: .75,
                accent: !0
            },
            {
                color: oe[t],
                roughness: .1,
                accent: !0
            }
        ];
    function Ge({ children: t, color: r = "white", roughness: i = 0, ...a }) {
        const o = s.useRef(null), { nodes: n, materials: m } = Pe("/c-transformed.glb");
        return ge((l, v)=>{
            lt(o.current.material.color, r, .2, v);
        }), e.jsxs("mesh", {
            ref: o,
            castShadow: !0,
            receiveShadow: !0,
            scale: 10,
            geometry: n.connector.geometry,
            children: [
                e.jsx("meshStandardMaterial", {
                    metalness: .2,
                    roughness: i,
                    map: m.base.map
                }),
                t
            ]
        });
    }
    function Ee({ position: t, children: r, vec: i = new Be, accent: a, color: o = "white", roughness: n = 0 }) {
        const m = s.useRef(null), l = st.randFloatSpread, v = s.useMemo(()=>t ?? [
                l(10),
                l(10),
                l(10)
            ], []);
        return ge((b, p)=>{
            m.current?.applyImpulse(i.copy(m.current.translation()).negate().multiplyScalar(.2));
        }), e.jsxs(He, {
            linearDamping: 4,
            angularDamping: 1,
            friction: .1,
            position: v,
            ref: m,
            colliders: !1,
            children: [
                e.jsx(ce, {
                    args: [
                        .38,
                        1.27,
                        .38
                    ]
                }),
                e.jsx(ce, {
                    args: [
                        1.27,
                        .38,
                        .38
                    ]
                }),
                e.jsx(ce, {
                    args: [
                        .38,
                        .38,
                        1.27
                    ]
                }),
                r ?? e.jsx(Ge, {
                    color: o,
                    roughness: n
                }),
                a && e.jsx("pointLight", {
                    intensity: 4,
                    distance: 2.5,
                    color: o
                })
            ]
        });
    }
    function Ca({ vec: t = new Be }) {
        const r = s.useRef(null);
        return ge(({ mouse: i, viewport: a })=>{
            r.current?.setNextKinematicTranslation(t.set(i.x * a.width / 2, i.y * a.height / 2, 0));
        }), e.jsx(He, {
            position: [
                0,
                0,
                0
            ],
            type: "kinematicPosition",
            colliders: !1,
            ref: r,
            children: e.jsx(pt, {
                args: [
                    1
                ]
            })
        });
    }
    function Ra() {
        const [t, r] = s.useReducer((a)=>(a + 1) % oe.length, 0), i = s.useMemo(()=>Ma(t), [
            t
        ]);
        return e.jsxs(at, {
            onClick: r,
            shadows: !0,
            dpr: [
                1,
                1.5
            ],
            gl: {
                antialias: !1
            },
            camera: {
                position: [
                    0,
                    0,
                    15
                ],
                fov: 17.5,
                near: 1,
                far: 20
            },
            style: {
                width: "100%",
                height: "100%"
            },
            children: [
                e.jsx("color", {
                    attach: "background",
                    args: [
                        "#141622"
                    ]
                }),
                e.jsx("ambientLight", {
                    intensity: .4
                }),
                e.jsx("spotLight", {
                    position: [
                        10,
                        10,
                        10
                    ],
                    angle: .15,
                    penumbra: 1,
                    intensity: 1,
                    castShadow: !0
                }),
                e.jsxs(dt, {
                    gravity: [
                        0,
                        0,
                        0
                    ],
                    children: [
                        e.jsx(Ca, {}),
                        i.map((a, o)=>e.jsx(Ee, {
                                ...a
                            }, o)),
                        e.jsx(Ee, {
                            position: [
                                10,
                                10,
                                5
                            ],
                            children: e.jsx(Ge, {
                                children: e.jsx(rt, {
                                    clearcoat: 1,
                                    thickness: .1,
                                    anisotropicBlur: .1,
                                    chromaticAberration: .1,
                                    samples: 8,
                                    resolution: 512
                                })
                            })
                        })
                    ]
                }),
                e.jsx(ot, {
                    disableNormalPass: !0,
                    multisampling: 8,
                    children: e.jsx(nt, {
                        distanceFalloff: 1,
                        aoRadius: 1,
                        intensity: 4
                    })
                }),
                e.jsx(it, {
                    resolution: 256,
                    children: e.jsxs("group", {
                        rotation: [
                            -Math.PI / 3,
                            0,
                            1
                        ],
                        children: [
                            e.jsx(re, {
                                form: "circle",
                                intensity: 4,
                                "rotation-x": Math.PI / 2,
                                position: [
                                    0,
                                    5,
                                    -9
                                ],
                                scale: 2
                            }),
                            e.jsx(re, {
                                form: "circle",
                                intensity: 2,
                                "rotation-y": Math.PI / 2,
                                position: [
                                    -5,
                                    1,
                                    -1
                                ],
                                scale: 2
                            }),
                            e.jsx(re, {
                                form: "circle",
                                intensity: 2,
                                "rotation-y": Math.PI / 2,
                                position: [
                                    -5,
                                    -1,
                                    -1
                                ],
                                scale: 2
                            }),
                            e.jsx(re, {
                                form: "circle",
                                intensity: 2,
                                "rotation-y": -Math.PI / 2,
                                position: [
                                    10,
                                    1,
                                    0
                                ],
                                scale: 8
                            })
                        ]
                    })
                })
            ]
        });
    }
    function La() {
        return e.jsx(Ra, {});
    }
    Pe.preload("/c-transformed.glb");
    const Fa = s.lazy(()=>J(()=>import("./AboutStory-C_ZjFOdS.js"), __vite__mapDeps([5,4,3,2,1])).then((t)=>({
                default: t.AboutStory
            }))), za = s.lazy(()=>J(()=>import("./EcosystemServices-C-YjD_p_.js"), __vite__mapDeps([6,4,3,7,2,1])).then((t)=>({
                default: t.EcosystemServices
            }))), Ea = s.lazy(()=>J(()=>import("./ArcSlider-hRSab-q2.js"), __vite__mapDeps([8,4,3,7,2,1])).then((t)=>({
                default: t.ArcSlider
            }))), Aa = s.lazy(()=>J(()=>import("./Testimonials-D2GrObWj.js").then(async (m)=>{
                await m.__tla;
                return m;
            }), __vite__mapDeps([9,1,2,3,4])).then((t)=>({
                default: t.Testimonials
            }))), Pa = s.lazy(()=>J(()=>import("./BlogSection-BJl7Tanz.js"), __vite__mapDeps([10,4,3,2,1])).then((t)=>({
                default: t.BlogSection
            }))), Ba = {
        paddingTop: "var(--space-8x)",
        paddingBottom: "var(--space-8x)"
    }, pe = ({ id: t, className: r = "", children: i, revealMode: a = "blur", delay: o = 0, noPadding: n = !1 })=>e.jsx("section", {
            id: t,
            className: r,
            style: n ? void 0 : Ba,
            children: e.jsx(_e, {
                children: e.jsx(ia, {
                    mode: a,
                    delay: o,
                    children: i
                })
            })
        });
    function Ha() {
        return e.jsxs("main", {
            className: "min-h-screen bg-[var(--color-background-light)] selection:bg-[var(--color-primary)] selection:text-white",
            children: [
                e.jsx(Na, {}),
                e.jsx(ie, {}),
                e.jsx(jt, {}),
                e.jsxs("section", {
                    id: "hero",
                    style: {
                        minHeight: "100vh",
                        background: "#ffffff",
                        display: "flex",
                        flexDirection: "column",
                        paddingTop: "clamp(80px, 11vh, 120px)",
                        paddingBottom: "clamp(24px, 4vh, 40px)"
                    },
                    children: [
                        e.jsx("div", {
                            style: {
                                padding: "0 clamp(24px, 5vw, 64px)",
                                marginBottom: "clamp(16px, 3vh, 28px)"
                            },
                            children: e.jsx(ea, {})
                        }),
                        e.jsx("div", {
                            style: {
                                flex: 1,
                                margin: "0 clamp(12px, 2.5vw, 32px)",
                                borderRadius: "clamp(16px, 2vw, 24px)",
                                overflow: "hidden",
                                position: "relative",
                                minHeight: "clamp(300px, 58vh, 700px)"
                            },
                            children: e.jsx("div", {
                                style: {
                                    position: "absolute",
                                    inset: 0,
                                    zIndex: 0
                                },
                                children: e.jsx(La, {})
                            })
                        }),
                        e.jsx("div", {
                            style: {
                                display: "flex",
                                justifyContent: "center",
                                paddingTop: "clamp(12px, 2vh, 20px)"
                            },
                            children: e.jsx(x.div, {
                                animate: {
                                    y: [
                                        0,
                                        5,
                                        0
                                    ]
                                },
                                transition: {
                                    duration: 1.8,
                                    repeat: 1 / 0,
                                    ease: "easeInOut"
                                },
                                "aria-hidden": "true",
                                children: e.jsxs("svg", {
                                    width: "14",
                                    height: "22",
                                    viewBox: "0 0 14 22",
                                    fill: "none",
                                    style: {
                                        color: "rgba(0,0,0,0.22)"
                                    },
                                    children: [
                                        e.jsx("rect", {
                                            x: "1",
                                            y: "1",
                                            width: "12",
                                            height: "20",
                                            rx: "6",
                                            stroke: "currentColor",
                                            strokeWidth: "1.5"
                                        }),
                                        e.jsx("rect", {
                                            x: "6",
                                            y: "5",
                                            width: "2",
                                            height: "4",
                                            rx: "1",
                                            fill: "currentColor"
                                        })
                                    ]
                                })
                            })
                        })
                    ]
                }),
                e.jsx(wa, {}),
                e.jsx("div", {
                    id: "ecosystem",
                    className: "relative",
                    style: {
                        zIndex: 2
                    },
                    children: e.jsx(za, {})
                }),
                e.jsx("div", {
                    id: "about",
                    className: "relative",
                    style: {
                        zIndex: 2
                    },
                    children: e.jsx(s.Suspense, {
                        fallback: e.jsx(ue, {}),
                        children: e.jsx(Fa, {})
                    })
                }),
                e.jsx(pe, {
                    id: "services",
                    className: "bg-[var(--color-background-light)]",
                    noPadding: !0,
                    children: e.jsx(Ea, {})
                }),
                e.jsx(pe, {
                    id: "testimonials",
                    className: "bg-[var(--color-background-light)]",
                    children: e.jsx(Aa, {})
                }),
                e.jsx("div", {
                    id: "blog",
                    children: e.jsx(_e, {
                        children: e.jsx(s.Suspense, {
                            fallback: e.jsx(ue, {}),
                            children: e.jsx(Pa, {})
                        })
                    })
                }),
                e.jsx(pe, {
                    id: "contact",
                    className: "bg-[var(--color-background-light)]",
                    delay: .2,
                    noPadding: !0,
                    children: e.jsx(Sa, {})
                }),
                e.jsx(je, {})
            ]
        });
    }
    function Wa() {
        const [t, r] = s.useState(!1), i = s.useCallback(()=>r(!0), []);
        return e.jsxs(wt, {
            children: [
                !t && e.jsx(vt, {
                    onComplete: i
                }),
                e.jsx(Ha, {})
            ]
        });
    }
    _a = [
        {
            id: 1,
            title: "LinkedIn Lead Generation: The Ultimate Guide for B2B Success in 2026",
            img: "https://images.unsplash.com/photo-1611944212129-29977ae1398c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsaW5rZWRpbiUyMGJ1c2luZXNzJTIwbmV0d29ya2luZ3xlbnwxfHx8fDE3Mzc1MTQ4MDB8MA&ixlib=rb-4.1.0&q=80&w=1200",
            excerpt: "Master LinkedIn lead generation with proven strategies that convert connections into customers. Learn how to build a powerful B2B pipeline in Africa's growing digital economy.",
            metaDescription: "Discover the ultimate LinkedIn lead generation strategies for 2026. Learn proven B2B tactics, profile optimization, content marketing, and automation tools to generate quality leads.",
            content: "LinkedIn has evolved from a simple networking platform to the world's most powerful B2B lead generation engine. With over 900 million professionals worldwide and rapidly growing adoption across Africa, LinkedIn offers unprecedented opportunities for businesses to connect with decision-makers, build authority, and generate high-quality leads.",
            sections: [
                {
                    heading: "Why LinkedIn is Essential for B2B Lead Generation",
                    content: "LinkedIn isn't just another social media platform—it's where business happens. Unlike Facebook or Instagram, LinkedIn users are in a professional mindset, actively seeking business solutions, partnerships, and career opportunities. For African businesses expanding regionally or globally, LinkedIn provides direct access to decision-makers without geographical barriers. The platform's sophisticated targeting capabilities allow you to reach specific industries, job titles, company sizes, and even individual companies. This precision targeting means your lead generation efforts reach exactly the right people at the right time."
                },
                {
                    heading: "Optimizing Your LinkedIn Profile for Lead Generation",
                    content: "Your LinkedIn profile is your digital storefront—it must immediately communicate value and credibility. Start with a professional, high-quality headshot that builds trust. Your headline shouldn't just state your job title; it should communicate the transformation you provide. Instead of 'Marketing Manager,' try 'Helping African Tech Startups Scale Through Data-Driven Growth Strategies.' Your summary should tell your story while addressing your ideal client's pain points. Use the first two lines strategically—they appear before the 'see more' button. Include clear calls-to-action and make it easy for prospects to take the next step. Add rich media like presentations, case studies, and videos to showcase your expertise. Finally, gather recommendations and endorsements to build social proof."
                },
                {
                    heading: "Building a Strategic Content Marketing System",
                    content: "Content is the foundation of LinkedIn lead generation. Consistent, valuable content positions you as a thought leader and keeps you top-of-mind with prospects. Post 3-5 times per week, mixing different content types: insights and analysis, case studies and success stories, how-to guides and tutorials, industry news and commentary, and behind-the-scenes looks at your work. Use LinkedIn's native features like polls, carousels, and documents—the algorithm favors these formats. Write attention-grabbing hooks in your first line to stop the scroll. Include relevant hashtags (3-5 per post) but prioritize quality over quantity. Most importantly, engage authentically with comments—this extends your content's reach and builds relationships."
                },
                {
                    heading: "Mastering LinkedIn Outreach and Messaging",
                    content: "Cold outreach on LinkedIn requires finesse. The key is personalization at scale. Before sending connection requests, research your prospect's profile, recent posts, and company news. Your connection request note should be brief, personalized, and value-focused. Mention a specific detail from their profile or recent activity. Once connected, don't immediately pitch—this is the fastest way to get ignored. Instead, engage with their content, send a thoughtful thank-you message, and provide value first. When you do reach out with an offer, focus on their needs, not your services. Use questions to start conversations: 'I noticed you recently expanded into Kenya—what's been your biggest challenge with market entry?' This approach builds rapport and uncovers genuine pain points you can solve."
                },
                {
                    heading: "Leveraging LinkedIn Sales Navigator",
                    content: "LinkedIn Sales Navigator is the professional's secret weapon for lead generation. While it requires investment, the ROI can be substantial. Sales Navigator provides advanced search filters that go far beyond basic LinkedIn, allowing you to find prospects by seniority level, company headcount growth, and even technology usage. The lead recommendations feature uses AI to suggest prospects similar to your successful customers. You can save leads and accounts, receiving real-time alerts when they change jobs, post content, or appear in the news—perfect triggers for timely outreach. The InMail feature lets you message people outside your network, with significantly higher response rates than cold email. For African businesses targeting specific markets or industries, Sales Navigator's precision is invaluable."
                },
                {
                    heading: "Creating a Lead Magnet Ecosystem",
                    content: "Drive LinkedIn connections into your marketing funnel with compelling lead magnets. Create downloadable resources like industry reports, templates and checklists, case study compilations, or exclusive webinars. Promote these resources in your posts, profile featured section, and direct messages. Use LinkedIn's native document feature to share previews of your lead magnets—people can consume value immediately while you capture their information. For African markets, consider creating region-specific resources that address local challenges, regulations, or opportunities. This geographic relevance increases conversion rates significantly."
                },
                {
                    heading: "Automation Tools and Best Practices",
                    content: "Smart automation scales your LinkedIn lead generation without sacrificing authenticity. Tools like Dux-Soup, Phantombuster, and Expandi can automate profile visits, connection requests, and follow-up sequences. However, use automation carefully—LinkedIn actively monitors for platform abuse. Best practices include: Keep daily actions within LinkedIn's limits (max 100 connection requests per week), always personalize automated messages using variables, combine automation with genuine manual engagement, regularly review and update your sequences based on response rates, and never use automation for spammy tactics. Remember: automation should amplify your strategy, not replace human connection."
                },
                {
                    heading: "Measuring Success: LinkedIn Lead Generation Metrics",
                    content: "Track the right metrics to optimize your LinkedIn lead generation efforts. Key performance indicators include: Connection acceptance rate (aim for 30%+), profile views and search appearances, post engagement rate (likes, comments, shares), click-through rate on your content links, response rate to outreach messages, and most importantly, conversion rate from connection to qualified lead. Use LinkedIn's native analytics for profile and post performance. For comprehensive tracking, maintain a simple spreadsheet or CRM noting connection dates, conversation milestones, and conversion outcomes. Review your metrics weekly, identifying what's working and what needs adjustment."
                },
                {
                    heading: "Common Mistakes to Avoid",
                    content: "Avoid these LinkedIn lead generation pitfalls: Sending generic connection requests without personalization, immediately pitching after connections accept, posting inconsistently or not at all, using overly salesy or promotional language, ignoring comments on your posts, not optimizing your profile for your target audience, failing to follow up with warm leads, and treating LinkedIn like other social media platforms. LinkedIn rewards authentic relationship-building, not aggressive sales tactics. The businesses that succeed on LinkedIn are those that prioritize providing value, building genuine connections, and playing the long game."
                },
                {
                    heading: "The Future of LinkedIn Lead Generation in Africa",
                    content: "LinkedIn adoption is accelerating across Africa as digital transformation takes hold. Nigerian, Kenyan, South African, and Egyptian professionals are increasingly active on the platform, creating unprecedented opportunities for B2B businesses. The key to success in African markets is cultural sensitivity—understand local business etiquette, communication styles, and decision-making processes. Build relationships patiently, as African business culture often prioritizes trust and personal connection before transactions. Participate in African business groups, engage with local content creators, and position yourself as a bridge between markets. As Africa's digital economy grows, early movers on LinkedIn will establish themselves as category leaders."
                }
            ],
            author: "Chioma Adeyemi",
            date: "February 1, 2026",
            readTime: "12 min read",
            category: "Lead Generation",
            tags: [
                "LinkedIn",
                "B2B Marketing",
                "Lead Generation",
                "Social Selling",
                "Digital Marketing",
                "Sales Strategy"
            ]
        }
    ];
    function Oa({ posts: t, selectedPost: r, onClose: i, onNavigate: a }) {
        return s.useEffect(()=>(r !== null ? document.body.style.overflow = "hidden" : document.body.style.overflow = "", ()=>{
                document.body.style.overflow = "";
            }), [
            r
        ]), s.useEffect(()=>{
            const o = (n)=>{
                n.key === "Escape" && i();
            };
            return window.addEventListener("keydown", o), ()=>window.removeEventListener("keydown", o);
        }, [
            i
        ]), ht.createPortal(e.jsx(ne, {
            children: r !== null && e.jsxs(x.div, {
                className: "fixed inset-0 flex items-start justify-center overflow-y-auto",
                style: {
                    zIndex: 9999
                },
                initial: {
                    opacity: 0
                },
                animate: {
                    opacity: 1
                },
                exit: {
                    opacity: 0
                },
                transition: {
                    duration: .3
                },
                children: [
                    e.jsx(x.div, {
                        className: "absolute inset-0",
                        style: {
                            background: "rgba(4, 6, 8, 0.97)",
                            backdropFilter: "blur(16px)"
                        },
                        onClick: i
                    }),
                    e.jsxs(x.div, {
                        className: "relative w-full max-w-3xl mx-5 sm:mx-6 my-8 sm:my-12",
                        initial: {
                            opacity: 0,
                            y: 60,
                            scale: .97
                        },
                        animate: {
                            opacity: 1,
                            y: 0,
                            scale: 1
                        },
                        exit: {
                            opacity: 0,
                            y: 40,
                            scale: .97
                        },
                        transition: {
                            duration: .4,
                            ease: [
                                .22,
                                1,
                                .36,
                                1
                            ]
                        },
                        style: {
                            background: "#0a0c10",
                            border: "1px solid rgba(255,255,255,0.12)",
                            boxShadow: "0 24px 64px rgba(0,0,0,0.6)"
                        },
                        children: [
                            e.jsx("button", {
                                onClick: i,
                                className: "absolute top-4 right-4 z-10 w-10 h-10 flex items-center justify-center transition-colors duration-200",
                                style: {
                                    background: "rgba(255,255,255,0.08)",
                                    border: "1px solid rgba(255,255,255,0.15)",
                                    color: "rgba(255,255,255,0.7)"
                                },
                                children: e.jsx(De, {
                                    size: 18
                                })
                            }),
                            t[r].image && e.jsxs("div", {
                                className: "relative h-48 sm:h-72 md:h-96 overflow-hidden",
                                children: [
                                    e.jsx("img", {
                                        src: t[r].image,
                                        alt: t[r].title,
                                        className: "w-full h-full object-cover"
                                    }),
                                    e.jsx("div", {
                                        className: "absolute inset-0 bg-gradient-to-t from-[#0a0c10] via-transparent to-transparent opacity-80"
                                    }),
                                    e.jsxs("div", {
                                        className: "absolute bottom-4 left-4 right-4 sm:bottom-6 sm:left-8 sm:right-8",
                                        children: [
                                            e.jsx("span", {
                                                className: "inline-block px-3 py-1 mb-4 text-[10px] uppercase tracking-[0.2em] bg-[var(--color-secondary)] text-[var(--color-primary)]",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: t[r].category
                                            }),
                                            e.jsx("h2", {
                                                className: "text-white",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                                                    lineHeight: 1.05,
                                                    textShadow: "0 4px 20px rgba(0,0,0,0.5)"
                                                },
                                                children: t[r].title
                                            })
                                        ]
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                className: "px-5 sm:px-8 md:px-12 py-6 sm:py-8",
                                style: {
                                    color: "rgba(255,255,255,0.85)"
                                },
                                children: [
                                    !t[r].image && e.jsxs(e.Fragment, {
                                        children: [
                                            e.jsx("span", {
                                                className: "inline-block px-3 py-1 mb-4 text-[10px] uppercase tracking-[0.2em] bg-[var(--color-secondary)] text-[var(--color-primary)]",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)"
                                                },
                                                children: t[r].category
                                            }),
                                            e.jsx("h2", {
                                                className: "mb-6",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    fontSize: "clamp(1.5rem, 4vw, 2.5rem)",
                                                    lineHeight: 1.05,
                                                    color: "var(--color-text-dark)"
                                                },
                                                children: t[r].title
                                            })
                                        ]
                                    }),
                                    e.jsxs("div", {
                                        className: "flex flex-wrap items-center gap-5 mb-8 pb-6",
                                        style: {
                                            borderBottom: "1px solid rgba(255,255,255,0.1)"
                                        },
                                        children: [
                                            e.jsxs("div", {
                                                className: "flex items-center gap-2 text-sm opacity-60",
                                                children: [
                                                    e.jsx(be, {
                                                        size: 15,
                                                        className: "text-[var(--color-secondary)]"
                                                    }),
                                                    e.jsx("span", {
                                                        style: {
                                                            fontFamily: "var(--font-stack-body)"
                                                        },
                                                        children: t[r].author
                                                    })
                                                ]
                                            }),
                                            e.jsxs("div", {
                                                className: "flex items-center gap-2 text-sm opacity-60",
                                                children: [
                                                    e.jsx(ye, {
                                                        size: 15,
                                                        className: "text-[var(--color-secondary)]"
                                                    }),
                                                    e.jsx("span", {
                                                        style: {
                                                            fontFamily: "var(--font-stack-body)"
                                                        },
                                                        children: t[r].date
                                                    })
                                                ]
                                            }),
                                            e.jsxs("div", {
                                                className: "flex items-center gap-2 text-sm opacity-60",
                                                children: [
                                                    e.jsx(ve, {
                                                        size: 15,
                                                        className: "text-[var(--color-secondary)]"
                                                    }),
                                                    e.jsx("span", {
                                                        style: {
                                                            fontFamily: "var(--font-stack-body)"
                                                        },
                                                        children: t[r].readTime
                                                    })
                                                ]
                                            })
                                        ]
                                    }),
                                    e.jsx("blockquote", {
                                        className: "mb-6 sm:mb-8 pl-4 sm:pl-5 italic text-base sm:text-lg leading-relaxed",
                                        style: {
                                            borderLeft: "3px solid var(--color-secondary)",
                                            fontFamily: "var(--font-stack-body)",
                                            color: "var(--color-text-dark)",
                                            opacity: .85
                                        },
                                        children: t[r].excerpt
                                    }),
                                    e.jsx("div", {
                                        className: "text-sm sm:text-base leading-[1.8] mb-6 sm:mb-8",
                                        style: {
                                            fontFamily: "var(--font-stack-body)",
                                            color: "var(--color-text-dark)",
                                            opacity: .8
                                        },
                                        children: t[r].content || t[r].excerpt
                                    }),
                                    e.jsxs("div", {
                                        className: "flex flex-wrap items-center justify-between gap-3 sm:gap-4 pt-5 sm:pt-6 mt-2",
                                        style: {
                                            borderTop: "1px solid rgba(255,255,255,0.12)"
                                        },
                                        children: [
                                            e.jsx("button", {
                                                onClick: i,
                                                className: "px-4 py-2.5 sm:px-5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-colors duration-200",
                                                style: {
                                                    fontFamily: "var(--font-stack-heading)",
                                                    border: "1px solid rgba(255,255,255,0.2)",
                                                    color: "rgba(255,255,255,0.8)",
                                                    background: "transparent"
                                                },
                                                children: "Back to Articles"
                                            }),
                                            e.jsxs("div", {
                                                className: "flex gap-2",
                                                children: [
                                                    r > 0 && e.jsx("button", {
                                                        onClick: ()=>a(r - 1),
                                                        className: "px-4 py-2.5 sm:px-5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-colors duration-200",
                                                        style: {
                                                            fontFamily: "var(--font-stack-heading)",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            background: "rgba(255,255,255,0.06)",
                                                            color: "rgba(255,255,255,0.8)"
                                                        },
                                                        children: "Prev"
                                                    }),
                                                    r < t.length - 1 && e.jsx("button", {
                                                        onClick: ()=>a(r + 1),
                                                        className: "px-4 py-2.5 sm:px-5 sm:py-3 text-[10px] sm:text-[11px] uppercase tracking-[0.15em] transition-colors duration-200",
                                                        style: {
                                                            fontFamily: "var(--font-stack-heading)",
                                                            border: "1px solid rgba(255,255,255,0.2)",
                                                            background: "rgba(255,255,255,0.06)",
                                                            color: "rgba(255,255,255,0.8)"
                                                        },
                                                        children: "Next"
                                                    })
                                                ]
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        }), document.body);
    }
    function Da({ post: t, index: r, onClick: i }) {
        const a = s.useRef(null), [o, n] = s.useState({
            x: 0,
            y: 0
        }), [m, l] = s.useState({
            x: 50,
            y: 50,
            opacity: 0
        }), v = (y)=>{
            const u = a.current;
            if (!u) return;
            const h = u.getBoundingClientRect(), w = y.clientX - h.left, g = y.clientY - h.top, S = (w / h.width - .5) * 2, k = (g / h.height - .5) * 2;
            n({
                x: -k * 8,
                y: S * 8
            }), l({
                x: w / h.width * 100,
                y: g / h.height * 100,
                opacity: 1
            });
        }, b = ()=>{
            n({
                x: 0,
                y: 0
            }), l((y)=>({
                    ...y,
                    opacity: 0
                }));
        }, p = String(r + 1).padStart(2, "0");
        return e.jsx(x.article, {
            initial: {
                opacity: 0,
                y: 50
            },
            whileInView: {
                opacity: 1,
                y: 0
            },
            viewport: {
                once: !0,
                margin: "-40px"
            },
            transition: {
                duration: .7,
                delay: r * .1,
                ease: [
                    .22,
                    1,
                    .36,
                    1
                ]
            },
            onClick: i,
            className: "group cursor-pointer",
            style: {
                perspective: "800px"
            },
            children: e.jsxs("div", {
                ref: a,
                onMouseMove: v,
                onMouseLeave: b,
                style: {
                    transform: `rotateX(${o.x}deg) rotateY(${o.y}deg)`,
                    transition: o.x === 0 && o.y === 0 ? "transform 0.5s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.3s ease" : "transform 0.08s ease-out",
                    border: "2px solid var(--color-text-dark)",
                    borderRadius: 16,
                    boxShadow: o.x !== 0 || o.y !== 0 ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
                    background: "var(--color-background-light)",
                    position: "relative",
                    overflow: "hidden",
                    willChange: "transform"
                },
                children: [
                    e.jsx("div", {
                        className: "absolute inset-0 pointer-events-none",
                        style: {
                            background: `radial-gradient(200px circle at ${m.x}% ${m.y}%, rgba(164,108,252,0.12) 0%, transparent 70%)`,
                            opacity: m.opacity,
                            transition: "opacity 0.3s ease",
                            zIndex: 2
                        }
                    }),
                    e.jsx("div", {
                        className: "absolute top-4 right-4 select-none pointer-events-none",
                        style: {
                            fontFamily: "var(--font-stack-heading)",
                            fontSize: "5.5rem",
                            fontWeight: 900,
                            lineHeight: 1,
                            color: "transparent",
                            WebkitTextStroke: "1.5px rgba(164,108,252,0.18)",
                            transition: "color 0.35s ease, -webkit-text-stroke 0.35s ease",
                            zIndex: 1
                        },
                        children: p
                    }),
                    e.jsxs("div", {
                        className: "relative aspect-[16/10] overflow-hidden",
                        style: {
                            zIndex: 3
                        },
                        children: [
                            t.image ? e.jsx("img", {
                                src: t.image,
                                alt: t.title,
                                className: "w-full h-full object-cover transition-transform duration-700 group-hover:scale-105",
                                loading: "lazy",
                                style: {
                                    transform: `scale(1) translate(${o.y * -.3}px, ${o.x * .3}px)`,
                                    transition: o.x === 0 && o.y === 0 ? "transform 0.5s cubic-bezier(0.22,1,0.36,1)" : "transform 0.08s ease-out"
                                }
                            }) : e.jsx("div", {
                                className: "w-full h-full bg-gradient-to-br from-[var(--color-primary)] to-[var(--color-secondary)]"
                            }),
                            e.jsx("div", {
                                className: "absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent"
                            }),
                            e.jsx("div", {
                                className: "absolute top-4 left-4",
                                children: e.jsx("span", {
                                    className: "inline-block px-3 py-1 text-[10px] uppercase tracking-[0.2em]",
                                    style: {
                                        fontFamily: "var(--font-stack-heading)",
                                        borderRadius: 999,
                                        background: "rgba(0,0,0,0.65)",
                                        backdropFilter: "blur(8px)",
                                        border: "1px solid rgba(255,255,255,0.2)",
                                        color: "#ffffff"
                                    },
                                    children: t.category
                                })
                            })
                        ]
                    }),
                    e.jsxs("div", {
                        className: "p-5 sm:p-6",
                        style: {
                            position: "relative",
                            zIndex: 3
                        },
                        children: [
                            e.jsxs("div", {
                                className: "flex items-center gap-3 mb-4 text-[11px] tracking-wider uppercase opacity-65",
                                style: {
                                    fontFamily: "var(--font-stack-heading)"
                                },
                                children: [
                                    e.jsx("span", {
                                        children: t.date
                                    }),
                                    e.jsx("span", {
                                        className: "w-1 h-1 rounded-full bg-current"
                                    }),
                                    e.jsx("span", {
                                        children: t.readTime
                                    })
                                ]
                            }),
                            e.jsx("h3", {
                                className: "leading-tight mb-3 transition-colors duration-300 group-hover:text-[var(--color-secondary)]",
                                style: {
                                    color: "var(--color-text-dark)",
                                    fontFamily: "var(--font-stack-heading)",
                                    fontSize: "1.35rem",
                                    lineHeight: 1.15
                                },
                                children: t.title
                            }),
                            e.jsx("p", {
                                className: "text-sm leading-relaxed opacity-80 mb-5 line-clamp-2",
                                style: {
                                    fontFamily: "var(--font-stack-body)"
                                },
                                children: t.excerpt
                            }),
                            e.jsxs("div", {
                                className: "flex items-center justify-between pt-4",
                                style: {
                                    borderTop: "1px solid rgba(232,226,255,0.12)"
                                },
                                children: [
                                    e.jsx("span", {
                                        className: "text-[11px] tracking-wider uppercase opacity-65",
                                        style: {
                                            fontFamily: "var(--font-stack-heading)"
                                        },
                                        children: t.author
                                    }),
                                    e.jsx("div", {
                                        className: "w-8 h-8 flex items-center justify-center transition-all duration-300 group-hover:bg-[var(--color-primary)] group-hover:text-white",
                                        style: {
                                            border: "1px solid var(--color-text-dark)",
                                            borderRadius: 8,
                                            color: "var(--color-text-dark)"
                                        },
                                        children: e.jsx(fe, {
                                            size: 14
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        });
    }
    function Ga({ post: t, onClick: r }) {
        const [i, a] = s.useState(!1);
        return e.jsx(x.article, {
            initial: {
                opacity: 0,
                y: 40
            },
            whileInView: {
                opacity: 1,
                y: 0
            },
            viewport: {
                once: !0
            },
            transition: {
                duration: .7,
                ease: [
                    .22,
                    1,
                    .36,
                    1
                ]
            },
            onClick: r,
            onMouseEnter: ()=>a(!0),
            onMouseLeave: ()=>a(!1),
            className: "group cursor-pointer",
            style: {
                marginBottom: "clamp(32px, 4vw, 56px)"
            },
            children: e.jsxs("div", {
                style: {
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    minHeight: "auto",
                    border: "2px solid var(--color-text-dark)",
                    borderRadius: 16,
                    boxShadow: i ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
                    transform: i ? "translate(-3px,-3px)" : "translate(0,0)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    overflow: "hidden",
                    background: "var(--color-background-light)"
                },
                className: "featured-hero-grid",
                children: [
                    e.jsxs("div", {
                        className: "featured-hero-image",
                        style: {
                            position: "relative",
                            overflow: "hidden",
                            minHeight: "240px"
                        },
                        children: [
                            t.image ? e.jsx("img", {
                                src: t.image,
                                alt: t.title,
                                style: {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    transform: i ? "scale(1.04)" : "scale(1)",
                                    transition: "transform 0.7s cubic-bezier(0.22,1,0.36,1)"
                                },
                                loading: "lazy"
                            }) : e.jsx("div", {
                                style: {
                                    width: "100%",
                                    height: "100%",
                                    background: "var(--color-primary)"
                                }
                            }),
                            e.jsx("div", {
                                style: {
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to right, transparent 60%, rgba(var(--color-background-light-rgb, 255,255,255), 0.05) 100%)"
                                }
                            }),
                            e.jsxs("div", {
                                style: {
                                    position: "absolute",
                                    top: "20px",
                                    left: "20px",
                                    display: "flex",
                                    gap: "8px"
                                },
                                children: [
                                    e.jsx("span", {
                                        style: {
                                            padding: "6px 14px",
                                            fontSize: "0.65rem",
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                            fontFamily: "var(--font-stack-heading)",
                                            borderRadius: 999,
                                            background: "var(--color-primary)",
                                            color: "#ffffff",
                                            border: "1px solid var(--color-text-dark)"
                                        },
                                        children: "Featured"
                                    }),
                                    e.jsx("span", {
                                        style: {
                                            padding: "6px 14px",
                                            fontSize: "0.65rem",
                                            letterSpacing: "0.2em",
                                            textTransform: "uppercase",
                                            fontFamily: "var(--font-stack-heading)",
                                            background: "rgba(0,0,0,0.65)",
                                            backdropFilter: "blur(8px)",
                                            color: "#ffffff",
                                            border: "1px solid rgba(255,255,255,0.2)"
                                        },
                                        children: t.category
                                    })
                                ]
                            })
                        ]
                    }),
                    e.jsxs("div", {
                        className: "featured-hero-content",
                        style: {
                            padding: "clamp(32px, 4vw, 56px)",
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            borderLeft: "2px solid var(--color-text-dark)"
                        },
                        children: [
                            e.jsxs("div", {
                                children: [
                                    e.jsxs("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "16px",
                                            marginBottom: "20px",
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            opacity: .65,
                                            fontFamily: "var(--font-stack-heading)"
                                        },
                                        children: [
                                            e.jsxs("span", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px"
                                                },
                                                children: [
                                                    e.jsx(ye, {
                                                        size: 11
                                                    }),
                                                    " ",
                                                    t.date
                                                ]
                                            }),
                                            e.jsx("span", {
                                                style: {
                                                    width: "3px",
                                                    height: "3px",
                                                    borderRadius: "50%",
                                                    background: "currentColor"
                                                }
                                            }),
                                            e.jsxs("span", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "5px"
                                                },
                                                children: [
                                                    e.jsx(ve, {
                                                        size: 11
                                                    }),
                                                    " ",
                                                    t.readTime
                                                ]
                                            })
                                        ]
                                    }),
                                    e.jsx("h2", {
                                        style: {
                                            fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                                            fontWeight: 800,
                                            lineHeight: 1.1,
                                            color: "var(--color-text-dark)",
                                            fontFamily: "var(--font-stack-heading)",
                                            marginBottom: "20px",
                                            letterSpacing: "-0.02em",
                                            transition: "color 0.3s ease"
                                        },
                                        className: "group-hover:text-[var(--color-secondary)]",
                                        children: t.title
                                    }),
                                    e.jsx("p", {
                                        style: {
                                            fontSize: "clamp(0.875rem, 1.1vw, 1rem)",
                                            lineHeight: 1.7,
                                            opacity: .8,
                                            fontFamily: "var(--font-stack-body)",
                                            marginBottom: "32px"
                                        },
                                        children: t.excerpt
                                    })
                                ]
                            }),
                            e.jsxs("div", {
                                children: [
                                    e.jsxs("div", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "10px",
                                            marginBottom: "28px",
                                            paddingTop: "20px",
                                            borderTop: "1px solid rgba(232,226,255,0.12)"
                                        },
                                        children: [
                                            e.jsx("div", {
                                                style: {
                                                    width: "32px",
                                                    height: "32px",
                                                    borderRadius: "50%",
                                                    background: "var(--color-primary)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    color: "#ffffff",
                                                    fontSize: "0.7rem",
                                                    fontWeight: 700,
                                                    fontFamily: "var(--font-stack-heading)",
                                                    flexShrink: 0
                                                },
                                                children: t.author.charAt(0)
                                            }),
                                            e.jsx("div", {
                                                children: e.jsx("div", {
                                                    style: {
                                                        fontSize: "0.75rem",
                                                        fontWeight: 700,
                                                        fontFamily: "var(--font-stack-heading)",
                                                        color: "var(--color-text-dark)",
                                                        letterSpacing: "0.05em"
                                                    },
                                                    children: t.author
                                                })
                                            })
                                        ]
                                    }),
                                    e.jsxs("button", {
                                        style: {
                                            display: "inline-flex",
                                            alignItems: "center",
                                            gap: "8px",
                                            padding: "14px 24px",
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            fontFamily: "var(--font-stack-heading)",
                                            fontWeight: 700,
                                            border: "2px solid var(--color-text-dark)",
                                            background: i ? "var(--color-primary)" : "transparent",
                                            color: i ? "#ffffff" : "var(--color-text-dark)",
                                            cursor: "pointer",
                                            transition: "background 0.25s ease, color 0.25s ease",
                                            boxShadow: "var(--shadow-button)"
                                        },
                                        children: [
                                            "Read Article",
                                            e.jsx(fe, {
                                                size: 14
                                            })
                                        ]
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        });
    }
    qa = function({ posts: t, hideHeader: r = !1 }) {
        const [i, a] = s.useState(null), [o, n] = s.useState("All"), m = s.useMemo(()=>[
                "All",
                ...new Set(t.map((u)=>u.category))
            ], [
            t
        ]), l = o === "All" ? t : t.filter((u)=>u.category === o), v = (u)=>{
            const h = t.indexOf(u);
            a(h >= 0 ? h : 0);
        }, b = l[0], p = l.slice(1, 3), y = l.slice(3);
        return e.jsxs("section", {
            className: "relative",
            style: {
                background: "var(--color-background-light)",
                paddingTop: "clamp(60px, 8vw, 100px)",
                paddingBottom: "clamp(80px, 8vw, 120px)",
                overflow: "clip"
            },
            children: [
                e.jsxs("div", {
                    className: "container mx-auto px-5 sm:px-8 md:px-12 relative",
                    style: {
                        zIndex: 10
                    },
                    children: [
                        e.jsxs(x.div, {
                            style: {
                                marginBottom: "clamp(40px, 5vw, 64px)"
                            },
                            initial: {
                                opacity: 0,
                                y: 20
                            },
                            whileInView: {
                                opacity: 1,
                                y: 0
                            },
                            viewport: {
                                once: !0
                            },
                            transition: {
                                duration: .5
                            },
                            children: [
                                e.jsxs("div", {
                                    style: {
                                        display: "flex",
                                        flexWrap: "wrap",
                                        alignItems: "flex-end",
                                        justifyContent: "space-between",
                                        gap: "24px"
                                    },
                                    children: [
                                        !r && e.jsx("div", {
                                            children: e.jsxs("h2", {
                                                style: {
                                                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                                                    fontWeight: 900,
                                                    fontFamily: "var(--font-stack-heading)",
                                                    color: "var(--color-text-dark)",
                                                    lineHeight: 1,
                                                    letterSpacing: "-0.03em",
                                                    margin: 0
                                                },
                                                children: [
                                                    "Latest",
                                                    " ",
                                                    e.jsx("span", {
                                                        style: {
                                                            fontStyle: "italic",
                                                            fontWeight: 400
                                                        },
                                                        children: "Insights"
                                                    })
                                                ]
                                            })
                                        }),
                                        e.jsx("div", {
                                            style: {
                                                display: "flex",
                                                flexWrap: "wrap",
                                                gap: "6px"
                                            },
                                            children: m.map((u)=>e.jsx("button", {
                                                    onClick: ()=>n(u),
                                                    style: {
                                                        padding: "6px 12px",
                                                        fontSize: "0.6rem",
                                                        letterSpacing: "0.15em",
                                                        textTransform: "uppercase",
                                                        fontFamily: "var(--font-stack-heading)",
                                                        border: "1.5px solid var(--color-text-dark)",
                                                        borderRadius: 999,
                                                        background: o === u ? "var(--color-primary)" : "transparent",
                                                        color: o === u ? "#ffffff" : "var(--color-text-dark)",
                                                        cursor: "pointer",
                                                        transition: "background 0.2s, color 0.2s",
                                                        boxShadow: o === u ? "var(--shadow-button)" : "none"
                                                    },
                                                    children: u
                                                }, u))
                                        })
                                    ]
                                }),
                                e.jsx(x.div, {
                                    style: {
                                        marginTop: "28px",
                                        height: "2px",
                                        background: "var(--color-text-dark)",
                                        transformOrigin: "left"
                                    },
                                    initial: {
                                        scaleX: 0
                                    },
                                    whileInView: {
                                        scaleX: 1
                                    },
                                    viewport: {
                                        once: !0
                                    },
                                    transition: {
                                        duration: .8,
                                        delay: .2,
                                        ease: [
                                            .22,
                                            1,
                                            .36,
                                            1
                                        ]
                                    }
                                })
                            ]
                        }),
                        e.jsx(ne, {
                            mode: "wait",
                            children: l.length === 0 ? e.jsxs(x.div, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                exit: {
                                    opacity: 0
                                },
                                style: {
                                    textAlign: "center",
                                    padding: "80px 0"
                                },
                                children: [
                                    e.jsx("p", {
                                        style: {
                                            opacity: .75,
                                            marginBottom: "24px",
                                            fontFamily: "var(--font-stack-body)"
                                        },
                                        children: "No articles in this category."
                                    }),
                                    e.jsx("button", {
                                        onClick: ()=>n("All"),
                                        style: {
                                            padding: "12px 24px",
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.15em",
                                            textTransform: "uppercase",
                                            fontFamily: "var(--font-stack-heading)",
                                            background: "var(--color-primary)",
                                            color: "#ffffff",
                                            border: "2px solid var(--color-text-dark)",
                                            cursor: "pointer",
                                            boxShadow: "var(--shadow-button)"
                                        },
                                        children: "Show All"
                                    })
                                ]
                            }, "empty") : e.jsxs(x.div, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: 1
                                },
                                exit: {
                                    opacity: 0
                                },
                                transition: {
                                    duration: .3
                                },
                                children: [
                                    b && e.jsx(Ga, {
                                        post: b,
                                        onClick: ()=>v(b)
                                    }),
                                    p.length > 0 && e.jsx("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: p.length === 1 ? "1fr" : "1fr 1fr",
                                            gap: "clamp(20px, 3vw, 36px)",
                                            marginBottom: "clamp(20px, 3vw, 36px)"
                                        },
                                        className: "secondary-posts-grid",
                                        children: p.map((u, h)=>e.jsx($a, {
                                                post: u,
                                                index: h,
                                                onClick: ()=>v(u)
                                            }, `${u.title}-${h}`))
                                    }),
                                    y.length > 0 && e.jsx("div", {
                                        style: {
                                            display: "grid",
                                            gridTemplateColumns: "repeat(3, 1fr)",
                                            gap: "clamp(20px, 3vw, 36px)"
                                        },
                                        className: "grid-posts",
                                        children: y.map((u, h)=>e.jsx(Da, {
                                                post: u,
                                                index: h,
                                                onClick: ()=>v(u)
                                            }, `${u.title}-${h}`))
                                    })
                                ]
                            }, o)
                        })
                    ]
                }),
                e.jsx(Oa, {
                    posts: t,
                    selectedPost: i,
                    onClose: ()=>a(null),
                    onNavigate: a
                }),
                e.jsx("style", {
                    children: `
        @media (max-width: 768px) {
          .featured-hero-grid {
            grid-template-columns: 1fr !important;
          }
          .featured-hero-image {
            min-height: 220px !important;
            aspect-ratio: 16/9;
          }
          .featured-hero-content {
            border-left: none !important;
            border-top: 2px solid var(--color-text-dark) !important;
            padding: 20px !important;
          }
          .secondary-posts-grid {
            grid-template-columns: 1fr !important;
          }
          .grid-posts {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .grid-posts {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
      `
                })
            ]
        });
    };
    function $a({ post: t, index: r, onClick: i }) {
        const [a, o] = s.useState(!1);
        return e.jsx(x.article, {
            initial: {
                opacity: 0,
                y: 30
            },
            whileInView: {
                opacity: 1,
                y: 0
            },
            viewport: {
                once: !0
            },
            transition: {
                duration: .6,
                delay: r * .1,
                ease: [
                    .22,
                    1,
                    .36,
                    1
                ]
            },
            onClick: i,
            onMouseEnter: ()=>o(!0),
            onMouseLeave: ()=>o(!1),
            className: "group cursor-pointer",
            children: e.jsxs("div", {
                style: {
                    border: "2px solid var(--color-text-dark)",
                    boxShadow: a ? "var(--shadow-geometric-hover)" : "var(--shadow-geometric)",
                    transform: a ? "translate(-3px,-3px)" : "translate(0,0)",
                    transition: "box-shadow 0.3s ease, transform 0.3s ease",
                    background: "var(--color-background-light)",
                    overflow: "hidden"
                },
                children: [
                    e.jsxs("div", {
                        style: {
                            position: "relative",
                            overflow: "hidden",
                            aspectRatio: "16/9"
                        },
                        children: [
                            t.image ? e.jsx("img", {
                                src: t.image,
                                alt: t.title,
                                style: {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    display: "block",
                                    transform: a ? "scale(1.05)" : "scale(1)",
                                    transition: "transform 0.6s cubic-bezier(0.22,1,0.36,1)"
                                },
                                loading: "lazy"
                            }) : e.jsx("div", {
                                style: {
                                    width: "100%",
                                    paddingBottom: "56.25%",
                                    background: "var(--color-primary)"
                                }
                            }),
                            e.jsx("div", {
                                style: {
                                    position: "absolute",
                                    inset: 0,
                                    background: "linear-gradient(to top, rgba(0,0,0,0.35) 0%, transparent 50%)"
                                }
                            }),
                            e.jsx("div", {
                                style: {
                                    position: "absolute",
                                    top: "16px",
                                    left: "16px"
                                },
                                children: e.jsx("span", {
                                    style: {
                                        padding: "5px 12px",
                                        fontSize: "0.62rem",
                                        letterSpacing: "0.18em",
                                        textTransform: "uppercase",
                                        fontFamily: "var(--font-stack-heading)",
                                        background: "rgba(0,0,0,0.65)",
                                        backdropFilter: "blur(8px)",
                                        color: "#ffffff",
                                        border: "1px solid rgba(255,255,255,0.2)"
                                    },
                                    children: t.category
                                })
                            })
                        ]
                    }),
                    e.jsxs("div", {
                        style: {
                            padding: "clamp(20px, 3vw, 32px)"
                        },
                        children: [
                            e.jsxs("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    marginBottom: "14px",
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.12em",
                                    textTransform: "uppercase",
                                    opacity: .65,
                                    fontFamily: "var(--font-stack-heading)"
                                },
                                children: [
                                    e.jsxs("span", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        },
                                        children: [
                                            e.jsx(ye, {
                                                size: 10
                                            }),
                                            " ",
                                            t.date
                                        ]
                                    }),
                                    e.jsx("span", {
                                        style: {
                                            width: "2px",
                                            height: "2px",
                                            borderRadius: "50%",
                                            background: "currentColor"
                                        }
                                    }),
                                    e.jsxs("span", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "4px"
                                        },
                                        children: [
                                            e.jsx(ve, {
                                                size: 10
                                            }),
                                            " ",
                                            t.readTime
                                        ]
                                    })
                                ]
                            }),
                            e.jsx("h3", {
                                style: {
                                    fontSize: "clamp(1.1rem, 1.6vw, 1.4rem)",
                                    fontWeight: 800,
                                    lineHeight: 1.2,
                                    color: "var(--color-text-dark)",
                                    fontFamily: "var(--font-stack-heading)",
                                    marginBottom: "12px",
                                    letterSpacing: "-0.015em",
                                    transition: "color 0.25s"
                                },
                                className: "group-hover:text-[var(--color-secondary)]",
                                children: t.title
                            }),
                            e.jsx("p", {
                                style: {
                                    fontSize: "0.875rem",
                                    lineHeight: 1.6,
                                    opacity: .78,
                                    fontFamily: "var(--font-stack-body)",
                                    marginBottom: "20px",
                                    display: "-webkit-box",
                                    WebkitLineClamp: 2,
                                    WebkitBoxOrient: "vertical",
                                    overflow: "hidden"
                                },
                                children: t.excerpt
                            }),
                            e.jsxs("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                    paddingTop: "16px",
                                    borderTop: "1px solid rgba(232,226,255,0.1)"
                                },
                                children: [
                                    e.jsxs("span", {
                                        style: {
                                            display: "flex",
                                            alignItems: "center",
                                            gap: "6px",
                                            fontSize: "0.7rem",
                                            letterSpacing: "0.08em",
                                            textTransform: "uppercase",
                                            opacity: .7,
                                            fontFamily: "var(--font-stack-heading)"
                                        },
                                        children: [
                                            e.jsx(be, {
                                                size: 11
                                            }),
                                            " ",
                                            t.author
                                        ]
                                    }),
                                    e.jsx("div", {
                                        style: {
                                            width: "34px",
                                            height: "34px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            border: "1.5px solid var(--color-text-dark)",
                                            color: "var(--color-text-dark)",
                                            background: a ? "var(--color-primary)" : "transparent",
                                            transition: "background 0.25s, color 0.25s"
                                        },
                                        className: a ? "text-white" : "",
                                        children: e.jsx(fe, {
                                            size: 15
                                        })
                                    })
                                ]
                            })
                        ]
                    })
                ]
            })
        });
    }
    const Ya = _a.map((t, r)=>({
            title: t.title,
            excerpt: t.excerpt,
            content: t.content,
            author: t.author,
            date: t.date,
            readTime: t.readTime,
            category: t.category,
            featured: r === 0,
            image: t.img
        }));
    function Ae() {
        return e.jsxs("div", {
            className: "min-h-screen",
            style: {
                background: "var(--color-background-light)"
            },
            children: [
                e.jsx(ie, {}),
                e.jsxs("div", {
                    className: "container mx-auto px-6 md:px-12",
                    style: {
                        paddingTop: "clamp(100px, 12vw, 140px)",
                        paddingBottom: 0
                    },
                    children: [
                        e.jsx(x.div, {
                            initial: {
                                opacity: 0,
                                x: -16
                            },
                            animate: {
                                opacity: 1,
                                x: 0
                            },
                            transition: {
                                duration: .5,
                                delay: .1
                            },
                            style: {
                                display: "inline-block",
                                marginBottom: "16px",
                                padding: "6px 16px",
                                border: "2px solid var(--color-secondary)",
                                boxShadow: "4px 4px 0 var(--color-secondary)"
                            },
                            children: e.jsx("span", {
                                style: {
                                    fontSize: "0.68rem",
                                    letterSpacing: "0.3em",
                                    textTransform: "uppercase",
                                    fontFamily: "var(--font-stack-heading)",
                                    color: "var(--color-secondary)"
                                },
                                children: "Insights & Stories"
                            })
                        }),
                        e.jsxs(x.h1, {
                            initial: {
                                opacity: 0,
                                y: 16
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: .6,
                                delay: .15
                            },
                            style: {
                                fontSize: "clamp(2.4rem, 5vw, 4rem)",
                                fontWeight: 900,
                                fontFamily: "var(--font-stack-heading)",
                                color: "var(--color-text-dark)",
                                lineHeight: 1,
                                letterSpacing: "-0.03em",
                                marginBottom: "14px"
                            },
                            children: [
                                "All",
                                " ",
                                e.jsx("span", {
                                    style: {
                                        fontStyle: "italic",
                                        fontWeight: 400
                                    },
                                    children: "Articles"
                                })
                            ]
                        }),
                        e.jsx(x.p, {
                            initial: {
                                opacity: 0,
                                y: 10
                            },
                            animate: {
                                opacity: 1,
                                y: 0
                            },
                            transition: {
                                duration: .5,
                                delay: .25
                            },
                            style: {
                                fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                                lineHeight: 1.7,
                                opacity: .6,
                                fontFamily: "var(--font-stack-body)",
                                maxWidth: "560px",
                                marginBottom: 0
                            },
                            children: "Explore our latest insights on digital innovation, technology, and the African startup ecosystem."
                        })
                    ]
                }),
                e.jsx(qa, {
                    posts: Ya,
                    hideHeader: !0
                })
            ]
        });
    }
    const Va = [
        {
            title: "Information We Collect",
            content: [
                "We collect information you provide directly when you use our services, such as your name, email address, and any messages you send through our contact form.",
                "We automatically collect certain technical information when you visit our website, including your IP address, browser type, operating system, referring URLs, and pages viewed. This data helps us understand how visitors interact with our site.",
                "We may use cookies and similar tracking technologies to enhance your browsing experience and gather usage analytics."
            ]
        },
        {
            title: "How We Use Your Information",
            content: [
                "To provide, maintain, and improve our services and website.",
                "To respond to your inquiries, comments, or questions submitted through our contact form.",
                "To send you updates, newsletters, or marketing communications that you have opted in to receive.",
                "To analyze website usage trends and optimize the user experience.",
                "To protect against fraud, unauthorized access, and other illegal activities."
            ]
        },
        {
            title: "Information Sharing",
            content: [
                "We do not sell, trade, or rent your personal information to third parties.",
                "We may share your information with trusted service providers who assist us in operating our website and conducting our business, provided they agree to keep your information confidential.",
                "We may disclose your information when required by law, regulation, or legal process, or when we believe disclosure is necessary to protect our rights or the safety of others."
            ]
        },
        {
            title: "Data Security",
            content: [
                "We implement appropriate technical and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction.",
                "While we strive to protect your personal data, no method of transmission over the internet or electronic storage is completely secure. We cannot guarantee absolute security."
            ]
        },
        {
            title: "Your Rights",
            content: [
                "You have the right to access, correct, or delete your personal information held by us.",
                "You may opt out of receiving marketing communications at any time by following the unsubscribe instructions included in our emails.",
                "You may request a copy of the personal data we hold about you by contacting us directly."
            ]
        },
        {
            title: "Third-Party Links",
            content: [
                "Our website may contain links to third-party websites. We are not responsible for the privacy practices or content of these external sites. We encourage you to review the privacy policies of any third-party sites you visit."
            ]
        },
        {
            title: "Changes to This Policy",
            content: [
                "We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated effective date. We encourage you to review this policy periodically."
            ]
        },
        {
            title: "Contact Us",
            content: [
                "If you have any questions or concerns about this Privacy Policy, please contact us at shannon@h2hsocial.club."
            ]
        }
    ];
    function Ua() {
        return e.jsxs("div", {
            className: "min-h-screen flex flex-col",
            style: {
                background: "var(--color-background-light)"
            },
            children: [
                e.jsx(ie, {}),
                e.jsx("main", {
                    className: "flex-1",
                    children: e.jsxs("div", {
                        className: "container mx-auto px-6 md:px-12",
                        style: {
                            paddingTop: "clamp(100px, 12vw, 140px)",
                            paddingBottom: "clamp(48px, 8vw, 96px)"
                        },
                        children: [
                            e.jsx(x.div, {
                                initial: {
                                    opacity: 0,
                                    x: -16
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                transition: {
                                    duration: .5,
                                    delay: .1
                                },
                                style: {
                                    display: "inline-block",
                                    marginBottom: "16px",
                                    padding: "6px 16px",
                                    border: "2px solid var(--color-secondary)",
                                    boxShadow: "4px 4px 0 var(--color-secondary)"
                                },
                                children: e.jsx("span", {
                                    style: {
                                        fontSize: "0.68rem",
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        fontFamily: "var(--font-stack-heading)",
                                        color: "var(--color-secondary)"
                                    },
                                    children: "Legal"
                                })
                            }),
                            e.jsxs(x.h1, {
                                initial: {
                                    opacity: 0,
                                    y: 16
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .6,
                                    delay: .15
                                },
                                style: {
                                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                                    fontWeight: 900,
                                    fontFamily: "var(--font-stack-heading)",
                                    color: "var(--color-text-dark)",
                                    lineHeight: 1,
                                    letterSpacing: "-0.03em",
                                    marginBottom: "14px"
                                },
                                children: [
                                    "Privacy",
                                    " ",
                                    e.jsx("span", {
                                        style: {
                                            fontStyle: "italic",
                                            fontWeight: 400
                                        },
                                        children: "Policy"
                                    })
                                ]
                            }),
                            e.jsx(x.p, {
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .5,
                                    delay: .25
                                },
                                style: {
                                    fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                                    lineHeight: 1.7,
                                    opacity: .6,
                                    fontFamily: "var(--font-stack-body)",
                                    maxWidth: "560px",
                                    marginBottom: "8px"
                                },
                                children: "How we collect, use, and protect your information."
                            }),
                            e.jsx(x.p, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: .4
                                },
                                transition: {
                                    duration: .5,
                                    delay: .3
                                },
                                style: {
                                    fontSize: "0.8rem",
                                    fontFamily: "var(--font-stack-heading)",
                                    letterSpacing: "0.1em",
                                    marginBottom: "clamp(32px, 6vw, 64px)"
                                },
                                children: "Effective Date: March 1, 2026"
                            }),
                            e.jsx("div", {
                                className: "max-w-3xl space-y-10",
                                children: Va.map((t, r)=>e.jsxs(x.div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            duration: .5,
                                            delay: .3 + r * .06
                                        },
                                        children: [
                                            e.jsx("h2", {
                                                style: {
                                                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                                                    fontWeight: 700,
                                                    fontFamily: "var(--font-stack-heading)",
                                                    color: "var(--color-text-dark)",
                                                    letterSpacing: "0.04em",
                                                    marginBottom: "12px",
                                                    textTransform: "uppercase"
                                                },
                                                children: t.title
                                            }),
                                            e.jsx("div", {
                                                className: "space-y-3",
                                                children: t.content.map((i, a)=>e.jsx("p", {
                                                        style: {
                                                            fontSize: "0.95rem",
                                                            lineHeight: 1.75,
                                                            color: "rgba(232,226,255,0.7)",
                                                            margin: 0
                                                        },
                                                        children: i
                                                    }, a))
                                            })
                                        ]
                                    }, t.title))
                            })
                        ]
                    })
                }),
                e.jsx(je, {})
            ]
        });
    }
    const Xa = [
        {
            title: "Acceptance of Terms",
            content: [
                "By accessing or using the H2H Social website and services, you agree to be bound by these Terms and Conditions. If you do not agree to these terms, please do not use our services.",
                "We reserve the right to update or modify these terms at any time without prior notice. Your continued use of the site after any changes constitutes acceptance of the revised terms."
            ]
        },
        {
            title: "Services",
            content: [
                "H2H Social provides digital marketing, branding, web development, and related consultancy services. The specific scope, deliverables, and timelines for any engagement will be outlined in a separate agreement or proposal.",
                "We reserve the right to modify, suspend, or discontinue any part of our services at any time, with or without notice."
            ]
        },
        {
            title: "Intellectual Property",
            content: [
                "All content on this website, including but not limited to text, graphics, logos, images, and software, is the property of H2H Social or its content suppliers and is protected by applicable intellectual property laws.",
                "You may not reproduce, distribute, modify, or create derivative works from any content on this website without our express written permission.",
                "Upon full payment for services rendered, ownership of deliverables will transfer to the client as specified in the applicable project agreement."
            ]
        },
        {
            title: "User Conduct",
            content: [
                "You agree to use our website and services only for lawful purposes and in accordance with these terms.",
                "You may not use our services in any way that could damage, disable, overburden, or impair our servers or networks.",
                "You may not attempt to gain unauthorized access to any part of our services, other accounts, computer systems, or networks connected to our servers."
            ]
        },
        {
            title: "Payment Terms",
            content: [
                "Payment terms for services will be outlined in individual project proposals or contracts. Unless otherwise agreed, invoices are due within 14 days of receipt.",
                "Late payments may incur additional charges as specified in the applicable agreement.",
                "We reserve the right to suspend services for accounts with outstanding balances."
            ]
        },
        {
            title: "Limitation of Liability",
            content: [
                "H2H Social shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of our website or services.",
                "Our total liability for any claim arising from or related to our services shall not exceed the amount paid by you for the specific service giving rise to the claim.",
                "We do not guarantee that our website will be available at all times or that it will be free from errors or viruses."
            ]
        },
        {
            title: "Confidentiality",
            content: [
                "Both parties agree to maintain the confidentiality of any proprietary or sensitive information shared during the course of an engagement.",
                "This obligation of confidentiality shall survive the termination of any agreement between the parties."
            ]
        },
        {
            title: "Termination",
            content: [
                "Either party may terminate a service agreement with written notice as specified in the applicable contract.",
                "Upon termination, you remain responsible for any fees owed for services already rendered.",
                "We reserve the right to terminate or suspend your access to our website at our sole discretion, without notice, for conduct that we believe violates these terms or is harmful to other users."
            ]
        },
        {
            title: "Governing Law",
            content: [
                "These Terms and Conditions shall be governed by and construed in accordance with the laws of the Federal Republic of Nigeria.",
                "Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the courts of Lagos, Nigeria."
            ]
        },
        {
            title: "Contact Us",
            content: [
                "If you have any questions about these Terms and Conditions, please contact us at shannon@h2hsocial.club."
            ]
        }
    ];
    function Ka() {
        return e.jsxs("div", {
            className: "min-h-screen flex flex-col",
            style: {
                background: "var(--color-background-light)"
            },
            children: [
                e.jsx(ie, {}),
                e.jsx("main", {
                    className: "flex-1",
                    children: e.jsxs("div", {
                        className: "container mx-auto px-6 md:px-12",
                        style: {
                            paddingTop: "clamp(100px, 12vw, 140px)",
                            paddingBottom: "clamp(48px, 8vw, 96px)"
                        },
                        children: [
                            e.jsx(x.div, {
                                initial: {
                                    opacity: 0,
                                    x: -16
                                },
                                animate: {
                                    opacity: 1,
                                    x: 0
                                },
                                transition: {
                                    duration: .5,
                                    delay: .1
                                },
                                style: {
                                    display: "inline-block",
                                    marginBottom: "16px",
                                    padding: "6px 16px",
                                    border: "2px solid var(--color-secondary)",
                                    boxShadow: "4px 4px 0 var(--color-secondary)"
                                },
                                children: e.jsx("span", {
                                    style: {
                                        fontSize: "0.68rem",
                                        letterSpacing: "0.3em",
                                        textTransform: "uppercase",
                                        fontFamily: "var(--font-stack-heading)",
                                        color: "var(--color-secondary)"
                                    },
                                    children: "Legal"
                                })
                            }),
                            e.jsxs(x.h1, {
                                initial: {
                                    opacity: 0,
                                    y: 16
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .6,
                                    delay: .15
                                },
                                style: {
                                    fontSize: "clamp(2.4rem, 5vw, 4rem)",
                                    fontWeight: 900,
                                    fontFamily: "var(--font-stack-heading)",
                                    color: "var(--color-text-dark)",
                                    lineHeight: 1,
                                    letterSpacing: "-0.03em",
                                    marginBottom: "14px"
                                },
                                children: [
                                    "Terms &",
                                    " ",
                                    e.jsx("span", {
                                        style: {
                                            fontStyle: "italic",
                                            fontWeight: 400
                                        },
                                        children: "Conditions"
                                    })
                                ]
                            }),
                            e.jsx(x.p, {
                                initial: {
                                    opacity: 0,
                                    y: 10
                                },
                                animate: {
                                    opacity: 1,
                                    y: 0
                                },
                                transition: {
                                    duration: .5,
                                    delay: .25
                                },
                                style: {
                                    fontSize: "clamp(0.9rem, 1.2vw, 1.05rem)",
                                    lineHeight: 1.7,
                                    opacity: .6,
                                    fontFamily: "var(--font-stack-body)",
                                    maxWidth: "560px",
                                    marginBottom: "8px"
                                },
                                children: "The rules and guidelines that govern your use of our services."
                            }),
                            e.jsx(x.p, {
                                initial: {
                                    opacity: 0
                                },
                                animate: {
                                    opacity: .4
                                },
                                transition: {
                                    duration: .5,
                                    delay: .3
                                },
                                style: {
                                    fontSize: "0.8rem",
                                    fontFamily: "var(--font-stack-heading)",
                                    letterSpacing: "0.1em",
                                    marginBottom: "clamp(32px, 6vw, 64px)"
                                },
                                children: "Effective Date: March 1, 2026"
                            }),
                            e.jsx("div", {
                                className: "max-w-3xl space-y-10",
                                children: Xa.map((t, r)=>e.jsxs(x.div, {
                                        initial: {
                                            opacity: 0,
                                            y: 20
                                        },
                                        animate: {
                                            opacity: 1,
                                            y: 0
                                        },
                                        transition: {
                                            duration: .5,
                                            delay: .3 + r * .06
                                        },
                                        children: [
                                            e.jsx("h2", {
                                                style: {
                                                    fontSize: "clamp(1.1rem, 2vw, 1.35rem)",
                                                    fontWeight: 700,
                                                    fontFamily: "var(--font-stack-heading)",
                                                    color: "var(--color-text-dark)",
                                                    letterSpacing: "0.04em",
                                                    marginBottom: "12px",
                                                    textTransform: "uppercase"
                                                },
                                                children: t.title
                                            }),
                                            e.jsx("div", {
                                                className: "space-y-3",
                                                children: t.content.map((i, a)=>e.jsx("p", {
                                                        style: {
                                                            fontSize: "0.95rem",
                                                            lineHeight: 1.75,
                                                            color: "rgba(232,226,255,0.7)",
                                                            margin: 0
                                                        },
                                                        children: i
                                                    }, a))
                                            })
                                        ]
                                    }, t.title))
                            })
                        ]
                    })
                }),
                e.jsx(je, {})
            ]
        });
    }
    ct.createRoot(document.getElementById("root")).render(e.jsx(gt, {
        children: e.jsxs(xt, {
            children: [
                e.jsx(te, {
                    path: "/",
                    element: e.jsx(Wa, {})
                }),
                e.jsx(te, {
                    path: "/blog",
                    element: e.jsx(Ae, {})
                }),
                e.jsx(te, {
                    path: "/blog/:id",
                    element: e.jsx(Ae, {})
                }),
                e.jsx(te, {
                    path: "/privacy",
                    element: e.jsx(Ua, {})
                }),
                e.jsx(te, {
                    path: "/terms",
                    element: e.jsx(Ka, {})
                })
            ]
        })
    }));
});
export { _a as B, qa as S, be as U, De as X, _ as c, aa as i, we as u, __tla };
