export default class MilestoneHelper {
    /**
     * 
     * @param {string} layer 
     * @param {string} id 
     * @returns {boolean}
     */
    static has(layer, id) {
        return ((player[layer].milestones.includes(id) || player[layer].milestones.includes(id)) && !tmp[layer].deactivated)
    }

    static updateMilestones(layer) {
        if (tmp[layer].deactivated) return
        for (id in layers[layer].milestones) {
            if (!(hasMilestone(layer, id)) && layers[layer].milestones[id].done()) {
                player[layer].milestones.push(id)
                if (layers[layer].milestones[id].onComplete) layers[layer].milestones[id].onComplete()
                if (tmp[layer].milestonePopups || tmp[layer].milestonePopups === undefined) doPopup("milestone", tmp[layer].milestones[id].requirementDescription, "Milestone Gotten!", 3, tmp[layer].color);
                player[layer].lastMilestone = id
            }
        }
    }

    static milestoneShown(layer, id) {
        complete = player[layer].milestones.includes(id);
        auto = layers[layer].milestones[id].toggles;
    
        switch (options.msDisplay) {
            case "always":
                return true;
                break;
            case "last":
                return (auto) || !complete || player[layer].lastMilestone === id;
                break;
            case "automation":
                return (auto) || !complete;
                break;
            case "incomplete":
                return !complete;
                break;
            case "never":
                return false;
                break;
        }
        return false;
    }
}