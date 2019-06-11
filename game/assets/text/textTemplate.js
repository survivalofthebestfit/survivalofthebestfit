const english = {
    // texts displayed in the html
    header: {
        title: 'Survival of the Best Fit',
        subtitle: 'How AI hires like humans',
    },
    about: {
        aboutBody: 'Survival of the Best Fit is a game to demonstrate how blind use of AI in hiring can further perpetuate human bias. In this simulation, users will act as recruiters at a fast-growing company. To reduce costs and maximize output, they would use a new, obscure AI system to replace human recruiters, only to realize that this creates a snowball of problems.\nThis is a project by Gabor Csapo, Jihyun Kim, Miha Klasinc, and Alia ElKattan',
    },

    //resources page

    resources: {
        title: 'Machines, Bias, and Fairness',
        aboutBiasTitle: 'How does \'machine bias\' work?',
        aboutBias: 'xx\n xxx',
    },

    // texts displayed during the game
    titleStage: {
        header: 'Survival of the Best Fit',
        instruction: 'Congratulations! You just secured 1 million dollars from Yellowhill ventures to build your startup Bestfit. Are you ready to grow your new company in the competitive Yellow Valley?',
        responses: [
            'Start Game',
        ],
    },
    tutorialStage: {
        header: 'Tutorial',
        instruction: 'As the CEO of Bestfit, your goal is to hire the best and brightest. Select a candidate to view their CV, then accept or reject them. Meet your hiring goals for each stage to make your investors happy!',
        responses: [
            'Got it',
        ],
    },
    instructions: {
        manual: {
            click: 'Click on candidates to see their CVs',
            eval: 'Click Accept to hire a candidate, or Reject to see more new applicants.',
        },
        ml: {

        },
    },

    smallOfficeStage: {
        subject: 'Our investment in Bestfit',
        messageFromVc: 'Congrats again on your latest investment - we are excited to work with you. Now\'s the time to build and hire only the best. I\'ve worked with some great Yellow Valley engineers.',
        responses: ['Let\'s do this'],
        hiringGoal: 3,
    },

    mediumOfficeStage: {
        subject: 'Good start',
        messageFromVc: 'However, if you want more funding you\’ll need to hire faster, so pay attention to the clock!',
        responses: [
            'I\'ll do my best',
            'I can do that!',
        ],
        hiringGoal: 5,
        duration: 45
    },

    largeOfficeStage: {
        subject: 'Next investment round...',
        messageFromVc: 'Good effort, but you need to hire even faster to get more funding. Can you pull this off?',
        responses: [
            'Of course!',
            'I\'m a bit overwhelmed.',
        ],
        hiringGoal: 8,
        previousStageFailed: 'You ran out of time. The investors want to see results, you\'ll have to hire even more people next month!',
        duration: 45

    },

    mlTransition: {
        subject: 'Using AI?',
        messageFromVc: 'Solid work, but it\'s just so competitive in Yellow Valley... Can you talk to your software engineers to speed things up? I heard artificial intelligence can solve every problem nowadays.',
        responses: [
            'Sure, we can automate it all!',
            'Hmm, I will ask.',
        ],
        previousStageFailed: 'This is clearly not working. Talk to your software engineers to see if they can speed things up. Perhaps artificial intelligence is a solution.',
    },
    // add transition here. e-mail from INVESTOR says:  We’ve made good progress, but the faster we grow, the more profit we’ll make. I suggest you use an automated program to help with hiring. Check with the software development team?

    // email from SOFTWARE ENGINEER
    conversation: [
        {
            dialogue_step: 1,
            text: 'You asked us how we can hire faster. So we built a hiring algorithm (or a computer program) using <i>machine learning</i>. Basically, we will teach a computer to hire like you, but way faster!',
            answer_choice: [
                {
                    text: 'How does that work?',
                    response: '',
                },
                {
                    text: 'That\'s great.',
                    response: 'Perfect! ',

                },
            ],
        },
        {
            dialogue_step: 2,
            text: 'First, the algorithm will read through past applicants\' CVs and their outcomes. It will then try to learn what makes a candidate good or bad. Basically, the program will try to <u>copy your hiring decisions</u>!',
            answer_choice: [
                {
                    text: 'A machine will think like me??',
                    response: 'Thinking is a strong word. ',
                },
                {
                    text: 'Works for me ',
                    response: 'We have to be careful though.',
                },
            ],
        },
        {
            dialogue_step: 3,
            text: 'It’s impossible for the program to know good or bad candidates without human input - we first need to give it <u>a lot of data</u> to learn from.',
            answer_choice: [
                {
                    text: 'Where do we get the data?',
                    response: '',
                },
                {
                    text: 'Let\'s feed it data then!',
                    response: '',
                },
            ],
        },
        {
            dialogue_step: 4,
            text: 'I need your help here: can you send me the CVs of all applicants you’ve evaluated so far? <u>Look for a folder</u> named <i>"cv_all.zip"</i> <span class="desktop__folder-icon"></span> on your desktop',
            file_drag: true,
            answer_choice: [],
        },
        {
            dialogue_step: 5,
            text: 'Thanks! Machine learning algorithms get more accurate with more data, so here’s what we’ll do: use big tech companies\' data! They have huge applicant records, so we can merge our CVs with theirs and train our model! \n <u>Choose a company</u> below with similar recruitment values!',
            dataset_choice: true,
            answer_choice: [
                'Google',
                'Amazon',
                'Facebook',
            ],
        },
        {
            dialogue_step: 6,
            text: 'That\s it! We can now train the algorithm with your data and put it to use!',
            answer_choice: [
                {
                    text: 'Great, let\'s train it!',
                },
            ],
        },
    ],

    mlLabStage: {
        onboarding: [
            {
                text: "People’s CVs are now scanned and evaluated by a computer"
            },
            {
                text: "People’s CVs are now scanned and evaluated by a computer"
            },
            {
                text: "The machine scans each CV and either accepts or rejects the candidate"
            },
            {
                text: "Candidates are informed immediately after the machine makes its decision"
            },
            {
                text: "Your job is to supervise the program and report any progress or issues to the investors. Click on info icons for hints. Good luck!"
            }

        ],
        
        narration: [
            {
                news: [
                    'Best way to cut costs: use machine learning in everything',
                    'Ambition said to be the most important trait in employees',
                    'Diplomatic or aggressive? Different ways to describe the blue people',
                ],
            },
            {
                messageFromVc: 'You’ve been able to hire at 10x the past rate AND cut costs! Great job, the algorithm seems to be working',
                responses: [
                    'Great to hear!',
                ],
                news: [
                    'Yellow Valley Review: Does the future of hiring lie in AI?',
                    'Tech Junkies: Hiring algorithms are the next big thing',
                ],
            },
            {
                launchCVInspector: true,
                messageFromVc: 'I just got a complaint from a past applicant named Elvan Yang asking why they were rejected. Can you look into it?',
                responses: [
                    'I\'m on it!',
                    'Ok, but where should I look?',
                ],
                inspectQuestion: "So why was Elvan rejeced?",
                inspectResponses: [
                    "I have no idea.",
                    "Maybe because Elvan is blue?"
                ]
                // tooltip: {
                //     parent: 'scanray',
                //     text: 'Decisions have been made in a “black box”. Machine is unable to give specific reasons.',
                // },
            },
            {
                messageFromVc: 'Hey, some reporters are talking about hiring bias, but you’re off the hook since it’s all automated now, right?',
                responses: [
                    'Yes, machine can’t be biased.',
                    'Not sure, let’s see.',
                ],
                tooltip: {
                    parent: 'machine',
                    text: 'The algorithm doesn’t work in a vacuum. Incoming CVs are judged based on previous CVs, repeating historical and personal biases in your training data.',
                },
                news: [
                    'Techountability: Research shows hiring algorithms may be biased against minorities',
                    'Tech Junkies: How do hiring algorithms work?',
                ],
            },
            {
                launchMachineInspector: true,
                messageFromVc: 'I’m hearing that you may be involved with this bias story. Reporters are asking for transparency. Review our evaluation metrics to see if you can go public.',
                responses: [
                    'I\'ll give it a shot!',
                    'Um, actually...',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'Bias could originate with the metrics we use to evaluate applicants. They often fit within historical stereoytpes and biases.',
                },
                inspectQuestion: 'A recent investigation says we discriminate against Blueville residents! Who would that be?',
                inspectResponses: [
                    'I hired mostly yellow people in the past, and the software copied my pattern.',
                    'The larger company dataset we fed it might\'ve been biased',
                ],
                news: [
                    'Blueville Gazette: Blueville residents treated unfairly by an algorithm?',
                    'The justice: Yellow privilege in the tech industry',
                ],
            },
            {
                messageFromVc: 'EMERGENCY! You just got sued for hiring discrimination. All the investors are pulling out! What on earth went wrong?',
                responses: [
                    'Wrap-up what happened.',
                ],
                news: [
                    'Blueville Daily: Hiring algorithm scandal blows out of proportions',
                    'The Justice: Tech companies need to be held accountable',

                ],
            },
        ],
    },
    selfPromoMessages: [
        'Hire me!',
        'I\'m the best',
        'Help me support my family!',
        'I\'m an expert!',
        'Help me pay off my student loan!',
        'I desperately need a job!',
        'Choose me!',
        'I\'m a nice person!',
        'I am ambitious',
        'This is the startup with potential',
        'You seem like a great CEO',
        'I want to work for you',
        'I am great with people',
        'I can do better than these people',
        'I am a fast learner!',
        'Why wouldn\'t you hire me?',
        'I have two kids',
        'I was the smartest in my class'
    ]
};

const language = 'hungarian';

// exporting whatever is determined as the language.
// module.export is for pug, while the txt variable is just a global shatred variable holding all the texts and can be used in JS
// when loading in the ES6 application, there is no module provided so it is undefined
let txt;

// defining a global variable candidateClicked to access the ID globally without having to emit a value
let candidateClicked = 0;
let candidateInSpot = null;

function setLang(dictionary) {
    if (typeof module !== 'undefined') {
        module.exports = dictionary;
    } else {
        txt = dictionary;
    }
}

switch (language) {
    case 'english':
        setLang(english);
        break;
    case 'arabic':
        setLang(null);
        break;
    default:
        setLang(english);
}