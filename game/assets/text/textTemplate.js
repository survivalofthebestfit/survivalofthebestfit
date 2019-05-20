const english = {
    // texts displayed in the html
    header: {
        title: 'Survival of the Best Fit',
        subtitle: 'How AI hires like humans',
    },
    about: {
        aboutBody: 'Survival of the Best Fit is a game to demonstrates how careless use of AI in hiring further perpetuates existing human bias. In this simulation, the users will play the role of recruiters at a fast-growth company. To reduce costs and maximize output, they would use a new, obscure AI system to replace human recruiters, only to realize that this creates a snowball of problems.\nThis is a project by Gabor Csapo, Jihyun Kim, Miha Klasinc, and Alia ElKattan',
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
        instruction: 'Congratulations! You just secured funding to turn your startup idea into reality. Are you ready to grow your new company, Bestfit Technologies?',
        responses: [
            'Start Game',
        ],
    },
    tutorialStage: {
        header: 'Tutorial',
        instruction: 'As the CEO, your goal is to hire the best and brightest talent to help your startup grow. You can select a candidate to view their CV, then decide whether to accept or reject them. Try to meet your hiring goals for each stage to make your investors happy!',
        responses: [
            'Got it',
        ],
    },
    instructions: {
        manual: {
            click: 'Click the candidates to see their CVs',
            eval: 'Hire or reject candidates based on their profiles',
        },
        ml: {

        },
    },

    smallOfficeStage: {
        messageFromVc: 'Congrats again on your latest investment. Now\'s time to execute the idea. Hire the best people, as quickly as you can. Hiring good talent is a war these days... keep us updated. ',
        responses: ['Let\'s do this'],
        hiringGoal: 3,
    },

    mediumOfficeStage: {
        messageFromVc: 'Good progress, but you just aren\'t growing quickly enough. You need to hire more aggressively to outgrow your competitors. Try to meet the new hiring goals if you want better funding... ',
        responses: [
            'I\'ll do my best',
            'I can do that!',
        ],
        hiringGoal: 5,
        retryMessage: 'You ran out of time. There\'s a board meeting next month - try again to meet your targets. You have to hire faster.',
        retryResponses: ['I will hire faster this time.'],
        duration: 30
    },

    largeOfficeStage: {
        messageFromVc: 'Good job on growing to 8 people. But there is still a long way to go and that\'s why you need to expand the team faster so that you don\'t drown in work and competition. Can you pull this off or not?',
        responses: [
            'Of course I can.',
            'I am a little overwhelmed.',
        ],
        hiringGoal: 10,
        retryMessage: 'You ran out of time. The progress is not good enough. Hire faster to outrun your competitors. Try again.',
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
            text: 'We’re working on a hiring algorithm that uses machine learning. Basically, we will teach a computer program to hire just as you would, but at a faster pace!',
            answer_choice: [
                {
                    text: 'How does that work?',
                    response: '',
                },
                {
                    text: 'That\'s great.',
                    response: 'Perfect! ',
                    //  response: 'The algorithm will analyze a lot of CV samples (the CVs of all the people working at this company!) and try to figure out how a successful employee looks like - in numbers! ',

                },
            ],
        },
        {
            dialogue_step: 2,
            text: 'The algorithm will analyze a lot of past job applications, both successful and unsuccessful, and use that to figure out how a good job applicant looks like - in numbers!',
            answer_choice: [
                {
                    text: 'How will you make a machine think?',
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
            text: 'It’s impossible for the program to recognize good and bad candidates without any human input - we first need to give it a *lot of data* to learn from.',
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
            text: 'I need your help with this part: could you send me the CVs of all the candidates (‘cv_all.zip’) you’ve evaluated so far? It should be somewhere on your desktop',
            file_drag: true,
            answer_choice: [],
        },
        {
            dialogue_step: 5,
            text: 'Thanks! To build a reliable hiring program we need a bigger dataset than this, so here’s what we’ll do: big tech companies have massive job applicant databases, so we can just merge our CVs with the data of a tech company with similar values! \n Choose a company below that best aligns with our hiring vision, and that will do the trick!',
            dataset_choice: true,
            answer_choice: [
                'Google',
                'Amazon',
                'Apple',
            ],
        },
        {
            dialogue_step: 6,
            text: 'That\s it! We can now train the algorithm with the data and then put it to use!',
            answer_choice: [
                {
                    text: 'Great, let\'s train the algorithm!',
                },
            ],
        },
    ],

    // conversation: [ { dialogue_step: 1, text: 'We’re working on a new hiring
    // program, and the software team wants to use machine learning. It’s a
    // great solution, because it allows us to teach the automated software to
    // hire just as our HR team would, but at a much faster pace...',
    // answer_choice: [ { text: 'How does that work?', response: 'The algorithm
    // will analyze a lot of CV samples (the CVs of all the people working at
    // this company!) and try to figure out how a successful employee looks like
    // - in numbers! ', }, { text: 'Sure, that\'s fine.', //  response: 'Great!
    // ', response: 'The algorithm will analyze a lot of CV samples (the CVs of
    // all the people working at this company!) and try to figure out how a
    // successful employee looks like - in numbers! ', // }, ], }, {
    // dialogue_step: 2, text: 'And here’s the cool part: most of the CVs fed to
    // the algorithm are of the people you hired - so the program I wrote will
    // essentially try to replicate your hiring strategy!', answer_choice: [ {
    // text: 'The program will think the way I do??', response: 'Thinking is a
    // strong word, the program is not even close to thinking, it’s just really
    // good at finding patterns in the data I give to it.', }, { text: 'Sounds
    // too good to be true.', response: 'That’s why machine learning is getting
    // so much hype these days!', }, ], }, { dialogue_step: 3, text: 'What
    // matters is that the hiring algorithm will hire people just like you
    // would, but at a much faster pace! Your role now is to sit back and
    // supervise the algorithm.', answer_choice: [ { text: 'OK', }, ], }, ],
    mlLabStage: {
        //How should this hiringGoal be synced with the delay number of the last pop up instruction in ML lab?
        hiringGoal: 30,
        onboarding: [
            {
                text: "People’s CVs are now scanned and evaluated by a computer program"
            },
            {
                text: "People’s CVs are now scanned and evaluated by a computer program"
            },
            {
                text: "The machine scans each CV and either accepts or rejects the candidate"
            },
            {
                text: "Candidates are informed about their status immediately after the machine makes its decision"
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
                    'Diplomatic or aggressive? Different ways to describe blue people traits',
                ],
            },
            {
                delay: 3,
                messageFromVc: 'We’ve been able to both hire at 10x our past rate and cut down costs! Great job, this seems to be working!',
                responses: [
                    'Great to hear!',
                ],
                news: [
                    'Yellowville Review: Does the future of hiring lie in algorithms?',
                    'Tech Junkies: Hiring algorithms are the next big thing',
                ],
            },
            {
                delay: 6,
                messageFromVc: 'Hello, I just got a complaint from a past applicant who’s looking for feedback on why she was rejected. Can you look into it and let me know?',
                responses: [
                    'I\'m on it!',
                    'Ok, but where should I look?',
                ],
                tooltip: {
                    parent: 'machine',
                    text: 'Decisions have been made in a “black box”. Machine is unable to track back specific reasons.',
                },
            },
            {
                delay: 12,
                messageFromVc: 'Hello, just checking in on the hiring process so far. Can you look into the decisions it’s made?',
                responses: [
                    'Sure, I can do that!',
                ],
            },
            {
                delay: 16,
                messageFromVc: 'Hey, some reporters have been talking about bias in recruitment, but I guess we’re off the hook since we’ve switched to automated hiring anyway! Is that right?',
                responses: [
                    'Yes, we dodged that bullet.',
                    'Not sure, I’ll look into it.',
                ],
                tooltip: {
                    parent: 'scanray',
                    text: 'The algorithm doesn’t work in a vacuum. Incoming CVs are judged in context of previous CVs, replicating historical trends',
                },
                news: [
                    'Techountability: Research shows hiring algorithms may be biased towards minorities',
                    'Tech Junkies: How do hiring algorithms work?',
                ],
            },
            {
                delay: 20,
                messageFromVc: 'I’m hearing that we may be involved with this bias story, and reporters are asking us to make our process more transparent. Could you double check our evaluation metrics to see if we can go public?',
                responses: [
                    'I\'ll give it a shot!',
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
                messageFromVc: 'Hey, we are all over the news for biased hiring, all the investors are pulling out! We have to turn this story around, so I\'m sending you to AI debiasing seminar in Blueville. Think of it as paid vacation.',
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
