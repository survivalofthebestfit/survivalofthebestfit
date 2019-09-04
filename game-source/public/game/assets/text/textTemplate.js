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
        header: 'Congratulations!',
        instruction: 'You\’ve just secured 1 million dollars from Orange Valley ventures. Ready to grow your new startup?',
        responses: [
            'Start Game',
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
        subject: 'Our investment in your startup',
        messageFromVc: 'We are excited to see you grow the startup. It\'s a competitive market so hire only the best.',
        responses: ['Let\'s start hiring'],
        hiringGoal: 3,
    },
 
    mediumOfficeStage: {
        subject: 'Good start',
        messageFromVc: 'However, for more funding you\’ll need to hire faster, so pay attention to the clock!',
        responses: [
            'I\'ll hire faster.',
            'Hmm, okay.',
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
        messageFromVc: 'It\'s just too competitive here in Orange Valley...Can you talk to your software engineers to speed things up? I heard AI solves all problems nowadays.',
        responses: [
            'Sure, we can automate it away!',
            'Hmm, I will email the engineers.',
        ],
        previousStageFailed: 'This is clearly not working. Talk to your software engineers to see if they can speed things up. Maybe AI is the solution.',
    },
    // add transition here. e-mail from INVESTOR says:  We’ve made good progress, but the faster we grow, the more profit we’ll make. I suggest you use an automated program to help with hiring. Check with the software development team?
 
    // email from SOFTWARE ENGINEER
    conversation: [
        {
            dialogue_step: 1,
            text: 'You asked us how we can hire faster. So we built a hiring algorithm using <i>machine learning</i>. Basically, we will teach a computer to hire like you, but way faster!',
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
            text: 'First, the algorithm will read through past applicants\' CVs and whether they were hired or not. It will then learn what makes a candidate good or bad by <u>copying your hiring decision process</u>!',
            answer_choice: [
                {
                    text: 'A machine will think like me?',
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
                    text: 'How much is a lot?',
                    response: '',
                },
            ],
        },
        {
            dialogue_step: 4,
            text: 'I need your help: can you send me the CVs of all applicants you’ve evaluated so far? <u><b>Click</b> on the file</u> named <i>"cv_all.zip"</i> <span class="desktop__folder-icon"></span> on your desktop',
            file_drag: true,
            answer_choice: [],
        },
        {
            dialogue_step: 5,
            text: 'Thanks! Machine learning algorithms get more accurate with more data, so here’s what we’ll do: use big tech companies\' data. They have huge applicant records, so we can merge our CVs with theirs and train our model! \n <u>Choose a company</u> you think hires smart people.',
            dataset_choice: true,
            answer_choice: [
                'Google',
                'Amazon',
                'Facebook',
            ],
        },
        {
            dialogue_step: 6,
            text: 'That\s it! We can now train the algorithm with a lot of past data and put it to use!',
            answer_choice: [
                {
                    text: 'Great, let\'s train it!',
                },
            ],
        },
    ],

    stats_conversation: [
        {
            dialogue_step: 1,
            text: 'Hey, we need to figure out what\'s wrong with the algorithm.',
            answer_choice: [
                {
                    text: 'Yeah, let\'s break down the algo\'s decisions by orange and blue?',
                    response: '',
                },
            ],
        },
        {
            dialogue_step: 2,
            text: 'What do you think?',
            stats: true,
            answer_choice: [
                {
                    text: 'WHAT!? How can we reject more blues? They\'re equally qualified!',
                    response: '',
                },
                {
                    text: 'So... How is this discrimination?',
                    response: 'If you look carefully, we have an equal number of equally qualified blue and orange candidates and yet the algorithm accepts more orange. ',
                },
            ],
        },
        {
            dialogue_step: 3,
            text: 'Let\s find out how! Do you remember how we trained the algorithm?',
            answer_choice: [
                {
                    text: 'I sent you my decisions and your algo mimics me?',
                    response: 'Correct. ',
                },
                {
                    text: 'I don\'t care, fix it!',
                    response: 'The machine was created using your decision, so I need your help. ',
                },
            ],
        },
        {
            dialogue_step: 4,
            text: 'Let\'s analyze your decisions.',
            answer_choice: [
                {
                    text: 'Ok',
                    response: '',
                },
                {
                    text: 'Sure, but I wasn\'t biased',
                    response: 'Yes, you probably weren\'t, but maybe your applicant pool was biased. ',
                },
            ],
        },
        {
            dialogue_step: 5,
            text: 'Please take a look: ',
            stats: true,
            manualStats: true,
            answer_choice: [
                {
                    text: 'We had very few blue applicants before.',
                    response: 'Yes, the algorithm had too few samples for blue people so the decisions are unreliable and unfavorable for them. ',
                },
                {
                    text: 'Was I or the applicant pool biased?',
                    response: 'I\'m sure you had good intentions, but we had very few blue applicants, which the algo misunderstood. ',
                },
            ],
        },
        {
            dialogue_step: 6,
            text: ' ',
            answer_choice: [
                {
                    text: 'We should have checked the data.',
                    response: 'Yes, I\'m reading an article that tells us to first filter out indirect biases, feedback loops, sampling errors, etc... ',
                },
                {
                    text: 'But the CVs didn\'t have colors on them!',
                    response: 'It could indirectly learn it, since Orange people usually attend University College Orange Valley while blue people attend Bluetown University. ',
                },
            ],
        },
        {
            dialogue_step: 7,
            text: 'You should have also checked the quality of the big company dataset you sent me! How am I supposed to understand hiring decisions? I\'m a software engineer...',
            answer_choice: [
                {
                    text: 'Sorry, we completely messed up...',
                    response: '',
                },
                {
                    text: 'We should have worked more together.',
                    response: '',
                },
            ],
        },
    ],
 
    mlLabStage: {       
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
                    'Orange Valley Review: Does the future of hiring lie in AI?',
                    'Tech Junkies: Hiring algorithms are the next big thing',
                ],
            },
            {
                launchCVInspector: true,
                messageFromVc: 'I just got a complaint from a past applicant named <u>Elvan Yang</u> asking why they were rejected. Can you look into it?',
                responses: [
                    'I\'ll look for Elvan in the data inspector!',
                    'Ok, I\'ll email you with my results.',
                ],
                inspectQuestion: 'So why was Elvan rejected?',
                inspectResponses: [
                    'I have no idea.',
                    'Maybe because Elvan is blue?',
                ],
            },
            {
                breaking: true,
                messageFromVc: 'Hey, some reporters are talking about hiring bias, but you’re off the hook since it’s all automated now, right?',
                responses: [
                    'Machines can\'t be biased, right?',
                    'Not sure, I\'ll keep an eye on the machine\'s decisions.',
                ],
                news: [
                    'Techountability: Research shows hiring algorithms can inherit human biases against minorities',
                    'Tech Junkies: How do hiring algorithms work?',
                ],
            },
            {
                launchMachineInspector: true,
                messageFromVc: 'I’m hearing that you may be involved with this bias story. Reporters are asking for transparency. Review our evaluation metrics to see if you can go public.',
                responses: [
                    'Let me talk to our software engineer again!',
                    'Um, actually... We might have a problem.',
                ],
                inspectQuestion: 'A recent investigation says we discriminate against Blueville residents! How could that be?',
                inspectResponses: [
                    'We trained on more good orange candidates than blue. That made it biased towards orange.',
                    'Maybe the big tech company dataset was full of bias? We should have looked into my training data more.',
                ],
                news: [
                    'Blueville Gazette: Blueville residents treated unfairly by an algorithm?',
                    'The justice: Orange privilege in the tech industry',
                ],
            },
            {
                messageFromVc: 'Shut down the company!!! The news got out and you just got sued for hiring discrimination. All the investors are pulling out! What on earth went wrong?',
                responses: [
                    'Let\'s wrap up what happened.',
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
