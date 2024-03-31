export default class ParticleHelper {
    static particles = {};
    static particleID = 0;

    static constructParticleStyle(particle){
        let style =  {
            left: (particle.x  - particle.height/2) + 'px',
            top: (particle.y - particle.height/2) + 'px',
            width: particle.width + 'px',
            height: particle.height + 'px',
            transform: "rotate(" + particle.angle + "deg)",
            opacity: getOpacity(particle),
            "pointer-events": (particle.onClick || particle.onHover) ? 'auto' : 'none',
        }
        if (particle.color) {
            style["background-color"] = particle.color
            style.mask = "url(#pmask" + particle.id + ")"
            style["-webkit-mask-box-image"] = "url(" + particle.image + ")"
        }
        else 
            style["background-image"] = "url(" + particle.image + ")"
        return style
    }
}