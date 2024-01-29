#ifdef GL_ES
precision mediump float;
#endif

uniform float u_time;
uniform vec2 u_resolution;

float sdfStar5(in vec2 p, in float r, in float rf) {
    const vec2 k1 = vec2(0.809016994375, -0.587785252292);
    const vec2 k2 = vec2(-k1.x, k1.y);
    p.x = abs(p.x);
    p -= 2.0 * max(dot(k1, p), 0.0) * k1;
    p -= 2.0 * max(dot(k2, p), 0.0) * k2;
    p.x = abs(p.x);
    p.y -= r;
    vec2 ba = rf * vec2(-k1.y, k1.x) - vec2(0, 1);
    float h = clamp(dot(p, ba) / dot(ba, ba), 0.0, r);
    return length(p - ba * h) * sign(p.y * ba.x - p.x * ba.y);
}

float hash(vec2 p, float minValue, float maxValue) {
    return mix(minValue, maxValue, fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord, in float t) {
    vec2 p = (2.0 * fragCoord - u_resolution.xy) / u_resolution.y - vec2(1., 1.);

    float finalD = 1.;
    float d = 0.;
    for (int i = 0; i < 25; i++) {
        float offsetX = hash(vec2(i, 0.5), -2., 2.);
        float offsetY = hash(vec2(0.5, i), -2., 2.);
        vec2 pos = p + vec2(float(i) / 2. * cos(t), -3. + 6. * mod(t, 2.));
        pos += vec2(offsetX, offsetY);

        // Introduce some variations in size and shape
        float size = hash(vec2(i) * 10.0, 0.01, 0.5);
        float rf = hash(vec2(i) * 5.0, 0.05, 0.5);

        d = sdfStar5(pos, size, rf);
        finalD = min(d, finalD);
    }

    // Play with the color based on the final distance
    vec3 col = mix(vec3(1.,0.87,0.09), vec3(0.0, 0.44, 0.49), smoothstep(0.0, 0.01, finalD));

    fragColor = vec4(col, 1.0);
}

void main() {
    vec2 st = gl_FragCoord.xy / u_resolution;

    mainImage(gl_FragColor, gl_FragCoord.xy, u_time);
}
