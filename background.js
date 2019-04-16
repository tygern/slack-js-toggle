(function () {
    let urlPattern = "*://*.slack.com/*";

    function findJsStatus(callback) {
        chrome.contentSettings.javascript.get({primaryUrl: "https://www.slack.com/"}, function (details) {
            callback(details.setting)
        });
    }

    function updateBadge() {
        findJsStatus(function (setting) {
            let badgeColor = setting === "allow" ? "#4285F4" : "#C5211D";
            let badgeText = setting === "allow" ? "✓" : "✗";

            chrome.browserAction.setBadgeText({text: badgeText});
            chrome.browserAction.setBadgeBackgroundColor({color: badgeColor});
        });
    }

    function updateJsSetting(setting) {
        let newSetting = setting === "allow" ? "block" : "allow";

        chrome.contentSettings.javascript.set({
            primaryPattern: urlPattern,
            setting: newSetting,
        }, updateBadge);
    }

    function reloadSlackTabs() {
        chrome.tabs.query({url: urlPattern}, function (slackTabs) {
            slackTabs.forEach(function (tab) {
                chrome.tabs.reload(tab.id)
            });
        });
    }

    function toggleJsStatus() {
        findJsStatus(function (setting) {
            updateJsSetting(setting);
            reloadSlackTabs();
        });
    }

    updateBadge();
    chrome.browserAction.onClicked.addListener(toggleJsStatus);
})();
