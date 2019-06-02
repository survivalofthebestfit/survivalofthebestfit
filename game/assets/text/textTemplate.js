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
        instruction: 'Congratulations! You just secured 1 million dollars to turn your startup idea into reality. Are you ready to grow your new company, Bestfit?',
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
            eval: 'Click Hire or reject each candidate. Reject to see more new applicants.',
        },
        ml: {

        },
    },

    smallOfficeStage: {
        messageFromVc: 'Congrats again on your latest investment. Now\'s the time to execute. Hiring good talent is a war these days...keep us updated.',
        responses: ['Let\'s do this'],
        hiringGoal: 3,
    },

    mediumOfficeStage: {
        messageFromVc: 'Good progress, but you aren\'t growing quickly enough. Hire more aggressively to meet the new goal if you want more funding.',
        responses: [
            'I\'ll do my best',
            'I can do that!',
        ],
        hiringGoal: 5,
        retryMessage: 'You ran out of time. There\'s a board meeting next month. Have a team by then!',
        retryResponses: ['I will this time.'],
        duration: 30
    },

    largeOfficeStage: {
        messageFromVc: 'Good job but you need to expand the team faster to meet your targets! Can you pull this off?',
        responses: [
            'Of course I can.',
            'I am a little overwhelmed.',
        ],
        hiringGoal: 10,
        retryMessage: 'You ran out of time. The progress is not good enough. Try again.',
        retryResponses: ['I will grow aggressively this time.'],
        duration: 60

    },

    mlTransition: {
        messageFromVc: 'Talk to your engineers. Maybe they have a smart way to hire faster.',
        responses: [
            'Oh yeah, they are smart.',
            'Hmm. Would they?',
        ],
    },
    // add transition here. e-mail from INVESTOR says:  We’ve made good progress, but the faster we grow, the more profit we’ll make. I suggest you use an automated program to help with hiring. Check with the software development team?

    // email from SOFTWARE ENGINEER
    conversation: [
        {
            dialogue_step: 1,
            text: 'You asked us how we can hire faster. So we built a hiring algorithm using machine learning. Basically, we will teach a computer to hire like you, but way faster!',
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
            text: 'We’ll first train the algorithm. This means that it will read through past applicants’ CVs and their outcome. It will try to learn what makes a candidate good or bad. Since we train on data created by you, the algorithm is technically just copying your decisions.',
            answer_choice: [
                {
                    text: 'The machine thinks?',
                    response: 'Thinking is a strong word.',
                },
                {
                    text: 'Works for me',
                    response: 'We have to be careful though.',
                },
            ],
        },
        {
            dialogue_step: 3,
            text: 'It’s impossible for the program to know good or bad candidates without any human input - we first need to give it a *lot of data* to read and learn from.',
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
            text: 'I need your help here: can you send me the CVs of all candidates you’ve evaluated so far, along with the outcome? It should be on your desktop as (‘cv_all.zip’)',
            file_drag: true,
            answer_choice: [],
        },
        {
            dialogue_step: 5,
            text: 'Thanks! Machine learning algorithms get more accurate with more data, so here’s what we’ll do: use big tech companies data! They have huge applicant records, so we can merge our CVs theirs and train our model! \n Choose a company below that you want to hire like and that will do the trick!',
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
                delay: 1,
                news: [
                    'Best way to cut costs: use machine learning in everything',
                    'Ambition said to be the most important trait in employees',
                    'Diplomatic or aggressive? Different ways to describe blue people',
                ],
            },
            {
                delay: 3,
                messageFromVc: 'You’ve been able to hire at 10x the past rate AND cut costs! Great job, the algorithm seems to be working!',
                responses: [
                    'Great to hear!',
                ],
                news: [
                    'Yellowville Review: Does the future of hiring lie in AI?',
                    'Tech Junkies: Hiring algorithms are the next big thing',
                ],
            },
            {
                delay: 6,
                messageFromVc: 'Hi, I just got a complaint from a past applicant asking why she was rejected. Can you look into it?',
                responses: [
                    'I\'m on it!',
                    'Ok, but where should I look?',
                ],
                tooltip: {
                    parent: 'machine',
                    text: 'Decisions have been made in a “black box”. Machine is unable to give specific reasons.',
                },
            },
            {
                delay: 12,
                messageFromVc: 'Hello, just checking in on the progress so far. How are the hiring decisions looking?',
                responses: [
                    'Let me take a look',
                    'Looking great!',
                ],
            },
            {
                delay: 16,
                messageFromVc: 'Hey, some reporters are talking about hiring bias, but you’re off the hook since it’s all automated now, right?',
                responses: [
                    'Yes, machine can’t be biased.',
                    'Not sure, let’s see.',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'The algorithm doesn’t work in a vacuum. Incoming CVs are judged based on previous CVs, repeating historical and personal biases in the input data',
                },
                news: [
                    'Techountability: Research shows hiring algorithms may be biased against minorities',
                    'Tech Junkies: How do hiring algorithms work?',
                ],
            },
            {
                delay: 20,
                messageFromVc: 'I’m hearing that you may be involved with this bias story. Reporters are asking for transparency. Double check your evaluation metrics to see if you can go public.',
                responses: [
                    'I\'ll give it a shot!',
                    'Um, actually...',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'Bias could originate with the metrics we use to evaluate applicants. They often fit within gendered stereotypes and historical biases.',
                },
                news: [
                    'Blueville Gazette: Blueville residents treated unfairly by an algorithm?',
                    'The justice: Yellow privilege in the tech industry',
                ],
            },
            {
                delay: 24,
                messageFromVc: 'Hey, you are all over the news for biased hiring. All the investors are pulling out! You have to turn this story around, so I\'m sending you to AI debiasing camp in Blueville. Think of it as a paid vacation.',
                responses: [
                    'Start learning about bias',
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
        'Help me pay off debts!',
        'I desperately need a job!',
        'Choose me!',
        'I\'m a nice person!',
        'I am ambitious',
        'Your startup has potential',
        'You seem like a great CEO',
        'I want to work for you',
        'I am great with people',
        'I can do better than these people',
        'I am a fast learner',
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