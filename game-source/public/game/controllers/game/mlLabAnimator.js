import {uv2px, waitForSeconds} from '~/public/game/controllers/common/utils.js';
import {cvCollection} from '~/public/game/assets/text/cvCollection.js';
import {mlLabStageContainer} from '~/public/game/controllers/game/gameSetup';
import {eventEmitter} from '~/public/game/controllers/game/gameSetup.js';
import EVENTS from '~/public/game/controllers/constants/events.js';
import Machine from '~/public/game/components/pixi/ml-stage/machine';
import ResumeList from '~/public/game/components/pixi/ml-stage/resume-list';
import Floor from '~/public/game/components/pixi/manual-stage/floor';
import ConveyorBelt from '~/public/game/components/pixi/ml-stage/conveyor-belt';
import Door from '~/public/game/components/pixi/manual-stage/door';
import ResumeUI from '~/public/game/components/interface/ui-resume/ui-resume';
import DatasetView from '~/public/game/components/interface/ml/dataset-view/dataset-view';
import ScanRay from '~/public/game/components/pixi/ml-stage/scan-ray.js';
import DataServer from '~/public/game/components/pixi/ml-stage/data-server.js';
import People from '~/public/game/components/pixi/ml-stage/people.js';
import {dataModule} from '~/public/game/controllers/machine-learning/dataModule.js';
import TaskUI from '~/public/game/components/interface/ui-task/ui-task';

export default class MlLabAnimator {
    constructor() {
        this.size = 0;
        this.scale = 1;
        
        this.firstFloor = new Floor({type: 'first_floor'}).addToPixi(mlLabStageContainer);
        this.groundFloor = new Floor({type: 'ground_floor'}).addToPixi(mlLabStageContainer);
        this.door = new Door({
            type: 'doorAccepted',
            floor: 'ground_floor',
            floorParent: this.groundFloor,
            xAnchorUV: 0.08,
        }).addToPixi();
        
        this.machine = new Machine();        
        this.dataServers = [
            new DataServer({machine: this.machine, type: 'rejected'}),
            new DataServer({machine: this.machine, type: 'accepted'}),
        ];
        
        this.belt = new ConveyorBelt();
        this.resumeLine = new ResumeList();
        this.machineRay = new ScanRay({machine: this.machine});
        this.people = new People();
        
        this.datasetView = new DatasetView({});
        this.resumeUI = new ResumeUI({
            type: 'ml',
            features: cvCollection.cvFeatures,
            scores: cvCollection.cvData,
            candidateId: candidateClicked,
        });
        
        eventEmitter.on(EVENTS.RESIZE, this._resize.bind(this));

        this._setupTweens();
        this.startAnimation();

        this.task = new TaskUI({
            showTimer: false, 
            placeLeft: true,
            hires: txt.mlLabStage.narration[txt.mlLabStage.narration.length-1].delay
        });

        this.acceptedCount = 0;
        this.rejectedCount = 0;
    }

    getToInspectId() {
        return this.people.toInspectId;
    }

    _setupTweens() {
        this.resumeLineTween = this.resumeLine.createTween();
        this.machineRayTween = this.machineRay.getSprite();
        this.doorTween = this.door.getSprite();
        this.resumeScanTween = this.resumeUI.createScanTween();
        this.resumeMaskTween = this.resumeUI.createMaskTween();
        this.peopleTween = this.people.createTween();
        this.activeTween = this.resumeLineTween;
        
        this.resumeLineTween.on('end', this.animationFirstHalf.bind(this));
        this.resumeScanTween.eventCallback('onComplete', this.animationSecondHalf.bind(this));

        this.peopleTween.on('end', () => {
            this.peopleTween.reset();
        });
    }

    startAnimation() {
        this.stop = false;
        this.animationFirstHalf();
    }

    pauseAnimation() {
        this.stop = true;
    }

    evalFirstPerson() {
        const firstPerson = this.people.getFirstPerson();
        let status = dataModule.predict(firstPerson.getData()) == 1 ? 'accepted' : 'rejected';

        // make sure to always reject the first person
        if (this.people.toInspectId && firstPerson.id == this.people.toInspectId) {
            status = 'rejected';
        }

        this.people.removeFirstPerson(status);
        this.datasetView.handleNewResume({status: status, data: firstPerson.getData()});
        return status;
    }

    // once the conveyor belt (resume tween) animation is done:
    // 1. reset the conveyor belt animation
    // 2. show the resume of the first person in line
    // 3. play the conveyor belt scanline animation
    // 4. play resume scanline animation
    animationFirstHalf() {
        if (this.stop) return;
        // #1: reset conveyor belt animation
        this.resumeLineTween.reset();
        waitForSeconds(0.1)
            .then(() => {
                // #2: show the resume of the first person in line
                const person = this.people.getFirstPerson();
                if (person !== undefined) this.resumeUI.showCV(person.getData());
                // #3 play the conveyor belt scanline animation
                this.machineRayTween.visible = true;
                this.machineRayTween.animationSpeed = 0.8;
                this.machineRayTween.play();
                return waitForSeconds(0.4);
            })
            .then(() => {
                eventEmitter.emit(EVENTS.MAKE_ML_PEOPLE_TALK, {});
                // #4 play resume scanline animation
                this.activeTween = this.resumeScanTween;
                this.resumeUI.showScanline();

                this.resumeScanTween.restart();
                this.resumeMaskTween.restart();
            });
    }
   
    // once the scanline animation is done:
    // 1. evaluate a new candidate
    // 2. based on the evaluation, set up door and data server animations
    // 3. animate the line of people
    // 4. hide the resume
    // 5. play the scan ray animation backwards
    // 6. start a new conveyor belt animation
    animationSecondHalf() {
        // #1: evaluate new candidate
        const decision = this.evalFirstPerson();
        // #2: set up server/door animations
        if (decision === 'accepted') {
            eventEmitter.emit(EVENTS.ACCEPTED, this.acceptedCount++);
            this.dataServers[1].updateServerCounter(this.acceptedCount);
            this.door.playAnimation({direction: 'forward'});
        } else {
            eventEmitter.emit(EVENTS.REJECTED, this.rejectedCount++);
            const person = this.people.getFirstPerson();
            console.log("rejected id: " + person.id);
            dataModule.recordMLReject(person.id);
            this.dataServers[0].updateServerCounter(this.rejectedCount);
        };
        
        // #3: play the people line animation
        this.people.recalibrateTween(this.peopleTween);
        this.peopleTween.start();        

        // #4: hide & reset the resume scan 
        //     play machine scan backwards
        this.resumeUI.hideScanline();
        this.resumeUI.hide();
        this.machineRayTween.animationSpeed = -0.9;
        this.machineRayTween.play();
        // #5: start a new conveyor belt animation
        this.activeTween = this.resumeLineTween;
        this.resumeLineTween.start();
    }
    
    // the properties between componenets are entangled and there are tweens and objects that need to be resized from here
    // resume list: the tween needs to be updated once the conveyor belt expands
    // servers: we need to make sure that the machine is resized before the servers because they get the y position from each other
    // scanray: it's coupled with the machine
    _resize() {
        this.resumeLine.draw();
        this.resumeLineTween.from({x: this.resumeLine.resumeContainer.x}).to({x: this.resumeLine.resumeContainer.x - 2*this.resumeLine.resumeXOffset});
        this.machine.draw();
        this.dataServers.forEach((server) => server.draw());
        this.machineRay.draw();
    }

    destroyTweens() {
        this.resumeLineTween.clear(); // PIXI TWEEN
        this.resumeLineTween.remove();
        this.machineRayTween.destroy(); // PIXI spritesheet - destroy
        this.resumeScanTween.kill(); // GSAP tween - kill
    };

    destroy() {
        this.destroyTweens();
        this.conversationManager.destroy(); // unimplemented
        this.newsFeed.destroy();
        this.datasetView.destroy();
        this.firstFloor.destroy();
        this.groundFloor.destroy();
        this.door.destroy(); // unimplemented
        this.resumeLine.destroy();
        this.belt.destroy();
        this.machine.destroy(); // unimplemented
        this.dataServers.destroy(); // unimplemented
        this.machineRay.destroy(); // half implemented
        this.resumeUI.destroy();
        this.people.destroy();
        this.timeline.destroy();
    }
}