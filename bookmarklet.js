// build using https://make-bookmarklets.com/ and replace " with backticks
let config = localStorage.getItem("clockifyTimeToMoney");
let normalRate, overtimeRate, normalHoursCap, overtimeHoursCap;
let valid = true;

if (config != null) {
    config = JSON.parse(config);
    normalRate = parseFloat(config.normalRate);
    overtimeRate = parseFloat(config.overtimeRate);
    normalHoursCap = parseFloat(config.normalHoursCap);
    overtimeHoursCap = parseFloat(config.overtimeHoursCap);
}
else {
    normalRate = parseFloat(prompt(`What is your hourly rate?`));
    overtimeRate = parseFloat(prompt(`What is your overtime rate?`));
    normalHoursCap = parseFloat(prompt(`What is your normal hours cap?`, 40));
    overtimeHoursCap = parseInt(prompt(`What is your overtime hours cap?`, 10));

    // validate everything is a number
    if (isNaN(normalRate) || isNaN(overtimeRate) || isNaN(normalHoursCap) || isNaN(overtimeHoursCap)) {
        valid = false;
        alert("One of the values is invalid. Please try again, make sure to only use numbers.");
    }
    else {
        valid = true;
        // save the info to local storage
        localStorage.setItem("clockifyTimeToMoney", JSON.stringify({
            normalRate,
            overtimeRate,
            normalHoursCap,
            overtimeHoursCap,
        }));
    }
}



if(valid) {
    let clocks = [
        {
            // weekly clock
            parent: document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(1) > approval-header > div.cl-d-flex.cl-align-items-end.cl-mt-2.cl-mt-lg-0.cl-justify-content-lg-end.cl-max-width-85`),
            clock: document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(1) > approval-header > div.cl-d-flex.cl-align-items-end.cl-mt-2.cl-mt-lg-0.cl-justify-content-lg-end.cl-max-width-85 > div.cl-h2.cl-mb-0.cl-ml-2.cl-lh-1.ng-star-inserted`),
        },
    ];

    document.querySelectorAll(`#layout-main > div > tracker2 > div > div > div > div > entry-group`).forEach((element, index) => {
        clocks.push({
            parent: document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(${index + 1}) > div > entry-group-header > div > div:nth-child(2)`),
            clock: document.querySelector(`#layout-main > div > tracker2 > div > div > div > div > entry-group:nth-child(${index + 1}) > div > entry-group-header > div > div:nth-child(2) > div.cl-h2.cl-mb-0.cl-ml-2.cl-lh-1`),
        });
    });


    clocks.forEach((clock) => {
        // create a money counter for each clock
        const element = document.createElement('h2');
        element.textContent = convertTime(clock.clock.textContent);
        element.style = `margin: 0; margin-left: 2em;`;
        clock.parent.appendChild(element);
        clock.moneyElementReference = element;

    });

    // create an observer for weekly clock to trigger update of money elements. 
    const observer = new MutationObserver((mutationRecord) => {
        updateClocksMoney()
    });

    function updateClocksMoney(){
        clocks.forEach((clock) => {
            clock.time = convertTime(clock.clock.textContent);
        });

        // weekly clock calculation is done in one go. 
        const money = calculateRateWeekly(clocks[0].time);
        clocks[0].moneyElementReference.textContent = `$${money.toFixed(2)}`;

        let normalHoursAvailable = normalHoursCap;
        let overtimeHoursAvailable = overtimeHoursCap;

        // from down to top update money values in daily clocks
        for (let index = clocks.length - 1; index > 0; index--) {

            let currentTime = clocks[index].time;
            let currentMoney = 0;;

            if (currentTime > normalHoursAvailable) {
                // the rate is partially normal and partially overtime
                currentMoney = normalHoursAvailable * normalRate;
                currentTime -= normalHoursAvailable;
                normalHoursAvailable = 0;
                // if hours left is over ot cap only calculate based on the hours that can be paid.
                if (currentTime > overtimeHoursAvailable) {
                    // here we reduce the time as to trim the extra hours
                    currentTime = overtimeHoursAvailable;
                }

                currentMoney += currentTime * overtimeRate;
                overtimeHoursAvailable -= currentTime;
            }
            else {
                currentMoney = currentTime * normalRate;
                normalHoursAvailable -= currentTime;
            }

            clocks[index].money = currentMoney;
            clocks[index].moneyElementReference.textContent = `$${currentMoney.toFixed(2)}`;

        }
    }

    observer.observe(clocks[0].clock, { characterData: true, attributes: false, childList: false, subtree: true });
    updateClocksMoney() // run once for formatting purposes. Or if clocks are stopped

    function convertTime(timeString) {
        const time = timeString.trim();
        const times = time.split(':');
        const hours = parseInt(times[0]);
        const minutes = parseInt(times[1]);
        const seconds = parseInt(times[2]);
        return hours + (minutes / 60) + (seconds / 60 / 60);
        //return `$${(normalRate * rate).toFixed(2)}`
    }

    function calculateRateWeekly(time) {
        if (time > normalHoursCap) {
            // overtime
            let ot = time - normalHoursCap;
            if (ot > overtimeHoursCap) {
                // exceeded ot, no more money is awarded past cap
                ot = overtimeHoursCap;
            }
            return (normalHoursCap * normalRate) + (ot * overtimeRate);
        }
        else {
            // within normal hours cap
            return (time * normalRate);
        }
    }



}
