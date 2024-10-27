window.addEventListener("DOMContentLoaded", () => {
    const widget = nlxai.chatWidget.create({
        config: {
            botUrl: import.meta.env.VITE_BOT_URL,
            headers: {
                "nlx-api-key": import.meta.env.VITE_API_KEY,
            },
            languageCode: "en-US"
        },
        titleBar: {
            "title": "Support",
            "withCollapseButton": true,
            "withCloseButton": true,
            "logo": "https://img.icons8.com/?size=256&id=11683&format=png"
        },
        // CUSTOM BEHAVIOR SNIPPET
        onExpand: (conversationHandler) => {
            const checkMessages = (messages) => {
                if (messages.length === 0) {
                    conversationHandler.sendWelcomeIntent();
                }
                conversationHandler.unsubscribe(checkMessages);
            };
            conversationHandler.subscribe(checkMessages);
        },
        // CUSTOM BEHAVIOR SNIPPET END
        theme: {
            "primaryColor": "#2663da",
            "darkMessageColor": "#2663da",
            "lightMessageColor": "#EFEFEF",
            "white": "#FFFFFF",
            "fontFamily": "Inter, system-ui, Avenir, Helvetica, Arial, sans-serif",
            "spacing": 12,
            "borderRadius": 8,
            "chatWindowMaxHeight": 640
        }
    });
});