export default class PopupHelper {
    static activePopups = [];
    static popupID = 0;

// Function to show popups
    static doPopup(type = "none", text = "This is a test popup.", title = "", timer = 3, color = "") {
        switch (type) {
            case "achievement":
                popupTitle = "Achievement Unlocked!";
                popupType = "achievement-popup"
                break;
            case "challenge":
                popupTitle = "Challenge Complete";
                popupType = "challenge-popup"
                break;
            default:
                popupTitle = "Something Happened?";
                popupType = "default-popup"
                break;
        }
        if (title != "") popupTitle = title;
        popupMessage = text;
        popupTimer = timer;

        activePopups.push({ "time": popupTimer, "type": popupType, "title": popupTitle, "message": (popupMessage + "\n"), "id": popupID, "color": color })
        popupID++;
    }


    //Function to reduce time on active popups
    static adjustPopupTime(diff) {
        for (popup in activePopups) {
            activePopups[popup].time -= diff;
            if (activePopups[popup]["time"] < 0) {
                activePopups.splice(popup, 1); // Remove popup when time hits 0
            }
        }
    }
}