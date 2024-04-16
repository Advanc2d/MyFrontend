const TourGuideApi = (function () {

    const makeInstance = function (pageName) {
        let tg = new tourguide.TourGuideClient({
            exitOnClickOutside: false,
            steps: fetchSteps(pageName)
        });
        return tg;
    }

    const fetchSteps = function (pageName) {
        let steps;
        console.log("[ tgApi :: TourGuideApi.fetchSteps ] :: pageName → " + pageName);
        switch (pageName) {
            case 'dashboard':
                break;
            //Product Service
            case 'pdService':
                steps = TgGroup.tg_pdService();
                break;
            case 'pdServiceVersion':
                break;
            //Jira
            case 'jiraServer':
                break;
            case 'jiraConnection':
                break;

            //Requirement
            case 'reqAdd':
                break;
            case 'reqStatus':
                break;

            //Analysis
            case 'analysisGantt':
                break;
            case 'analysisResource':
                break;
            case 'analysisTime':
                break;
            default:
                console.log("[ tgApi :: TourGuideApi.fetchSteps ] ::  pageName → " + pageName + " :: 일치하는 케이스 없음");

        } //end of switch
        if (steps === undefined) {
            return TgGroup.sampleStep(pageName);
        }
        return steps;
    };

    return {fetchSteps : fetchSteps,
            makeInstance :makeInstance}; // 내부 함수 key : value ( function )
})();