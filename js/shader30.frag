#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

#define ss(x) smoothstep(unit, 0.0, x)

void mainImage(out vec4 fragColor, in vec2 fragCoord) {
    vec2 uv = (fragCoord - 0.5 * u_resolution.xy) / u_resolution.y * 4.0;
    float unit = 8.0 / u_resolution.y;
    vec3 color = vec3(0.01, 0.25, .03);

    float w = 15.0 / u_resolution.y, hw = 0.5 * w;
    float stripeMask = ss(abs(mod(dot(uv, vec2(-0.71, -0.71)) + hw, w) - hw));

    vec2 stripeUv1 = mod(vec2(uv.x, uv.y + 2.0), 4.0) - 2.0*sin(u_time/50.);
vec2 stripeUv2 = abs(stripeUv1) - 0.75-cos(u_time);
vec2 stripeUv3 = abs(stripeUv1) - 0.55+sin(u_time/10.);
vec2 stripeUv4 = abs(stripeUv1) - 0.9+sin(u_time);

    float vertRedStripes = abs(stripeUv2.x) - 0.35*abs(sin(u_time));
    color = mix(color, vec3(.49, 0.0, 0.0), ss(vertRedStripes) * stripeMask);

    float horiRedStripes = abs(stripeUv2.y) - 0.35*abs(sin(u_time));
    color = mix(color, vec3(.49, 0.0, 0.0), ss(horiRedStripes) * stripeMask);

    color = mix(color, vec3(.49, 0.0, 0.0), ss(max(vertRedStripes, horiRedStripes)));

    float vertRed2Stripes = abs(stripeUv3.x+abs(sin(u_time/2.))) - 0.15;
    color = mix(color, vec3(.49, 0.0, 0.0), ss(vertRed2Stripes) * stripeMask);

    float horiRed2Stripes = abs(stripeUv3.y+abs(sin(u_time/2.))) - 0.15;
    color = mix(color, vec3(.49, 0.0, 0.0), ss(horiRed2Stripes) * stripeMask);

    color = mix(color, vec3(.49, 0.0, 0.0), ss(max(vertRed2Stripes, horiRed2Stripes)));

    float vertBlackStripes = abs(stripeUv4.x) - 0.075;
    color = mix(color, vec3(0.25*abs(sin(u_time/4.))), ss(vertBlackStripes) * stripeMask);

    float horiBlackStripes = abs(stripeUv4.y) - 0.075;
    color = mix(color, vec3(0.25*abs(sin(u_time/4.))), ss(horiBlackStripes) * stripeMask);

    color = mix(color, vec3(abs(0.25*sin(u_time/4.))), ss(max(vertBlackStripes, horiBlackStripes)));

    float whiteStripes = min(abs(stripeUv1.x), abs(stripeUv1.y));
    color = mix(color, vec3(abs(cos(u_time)),abs(cos(u_time/2.)),abs(cos(u_time/3.))), ss(whiteStripes) * stripeMask);

    float blackStripes = min(abs(abs(stripeUv1.x) - 0.1), abs(abs(stripeUv1.y) - 0.1));
    color = mix(color, vec3(0.0), ss(blackStripes) * stripeMask);

    float yellowStripes = min(abs(abs(stripeUv2.x) - 0.05), abs(abs(stripeUv2.y) - 0.05));
    color = mix(color, vec3(1.0, 1.0, 0.0), ss(yellowStripes) * stripeMask);

    fragColor = vec4(color, 1.0);
}

void main() {
    mainImage(gl_FragColor, gl_FragCoord.xy);
}
