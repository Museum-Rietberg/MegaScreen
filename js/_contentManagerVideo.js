class ContentManager {
    constructor() {
        this.schedule = [];
        this.currentCycleIndex = 0;
        this.cycleDuration = 180000; // [ms] 180000 = 3 minutes
        this.fadeTransitionDuration = 1000; // [ms] 1000 = 1 second
        this.activeScheduledContents = [];
    }

    async init() {
        try {
            await this.loadSchedule();
            return Promise.resolve();
        } catch (error) {
            console.error('Error initializing ContentManager:', error);
            return Promise.reject(error);
        }
    }

    async loadSchedule() {
        try {
            const response = await fetch('contentSchedule.json');
            const data = await response.json();
            this.schedule = data.contents;
            this.cycleDuration = data.config?.cycleDuration || this.cycleDuration;
            this.initializeContent();
            this.startScheduleCheck();
            this.startContentCycle();
        } catch (error) {
            console.error('Error loading schedule:', error);
            throw error; // Re-throw to be caught by init()
        }
    }

    initializeContent() {
        const container = document.getElementById('changingContent');
        container.innerHTML = this.schedule.map(item => {
            if (item.type === 'video') {
                return this.createVideoContent(item);
            } else {
                return this.createImageContent(item);
            }
        }).join('');
    }

    createVideoContent(item) {
        return `
            <div id="${item.id}" class="slideContent" style="display: none; opacity: 0; transition: opacity ${this.fadeTransitionDuration}ms ease-in-out;">
                <video class="fade content-de" src="${item.content.de}" muted></video>
                <video class="fade content-en" src="${item.content.en}" muted></video>
                <video class="fade content-fr" src="${item.content.fr}" muted></video>
            </div>`;
    }

    createImageContent(item) {
        return `
            <div id="${item.id}" class="slideContent" style="display: none; opacity: 0; transition: opacity ${this.fadeTransitionDuration}ms ease-in-out;">
                <img src="${item.content.image}" alt="">
                <img class="fade content-de" src="${item.content.de}" alt="">
                <img class="fade content-en" src="${item.content.en}" alt="">
                <img class="fade content-fr" src="${item.content.fr}" alt="">
            </div>`;
    }
    checkSchedule() {
        const now = new Date();
        this.activeScheduledContents = [];

        // Find all currently scheduled content
        for (const item of this.schedule) {
            for (const timeSlot of item.schedule) {
                const start = new Date(timeSlot.start);
                const end = new Date(timeSlot.end);

                if (now >= start && now <= end) {
                    this.activeScheduledContents.push(item.id);
                    break;
                }
            }
        }

        return this.activeScheduledContents.length > 0;
    }

    async showContent(contentId) {
        // Pause and reset all videos
        const allVideos = document.querySelectorAll('.slideContent video');
        allVideos.forEach(video => {
            video.pause();
            video.currentTime = 0;
        });

        // Hide all content with fade
        const allContent = this.schedule.map(item => document.getElementById(item.id));
        allContent.forEach(element => {
            if (element && element.style.display !== 'none') {
                element.style.opacity = '0';
                setTimeout(() => {
                    element.style.display = 'none';
                }, this.fadeTransitionDuration);
            }
        });

        // Show new content with fade
        const newContent = document.getElementById(contentId);
        if (newContent) {
            newContent.style.display = 'block';
            // Trigger reflow to ensure transition works
            newContent.offsetHeight;
            newContent.style.opacity = '1';

            // Start playing videos in new content if any
            const videos = newContent.querySelectorAll('video');
            videos.forEach(video => {
                video.play().catch(e => console.log('Auto-play prevented:', e));
            });
        }
    }

    cycleContent() {
        const hasScheduledContent = this.checkSchedule();
        
        if (hasScheduledContent) {
            // Cycle through active scheduled content
            this.currentCycleIndex = (this.currentCycleIndex % this.activeScheduledContents.length);
            const nextContentId = this.activeScheduledContents[this.currentCycleIndex];
            this.showContent(nextContentId);
            this.currentCycleIndex++;
        } else {
            // Cycle through all content when no schedule is active
            this.currentCycleIndex = (this.currentCycleIndex % this.schedule.length);
            const nextContentId = this.schedule[this.currentCycleIndex].id;
            this.showContent(nextContentId);
            this.currentCycleIndex++;
        }
    }

    startScheduleCheck() {
        this.checkSchedule();
        setInterval(() => this.checkSchedule(), 1000);
    }

    startContentCycle() {
        this.cycleContent();
        setInterval(() => this.cycleContent(), this.cycleDuration);
    }
}