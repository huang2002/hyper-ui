interface TimerProps {
    start?: number;
}

interface TimerStore {
    time: number;
    timer: any;
}

const Timer = HUI.define<TimerProps, TimerStore, {}>('Timer', {

    state: ['time'],

    init(props, store) {
        store.set('time', props.start || 0);
        store.set('timer', setInterval(store.inc, 1000, 'time'));
    },

    render(props, store) {
        return (
            <HUI.Fragment>
                Time: <span>{store.get('time')}</span>
            </HUI.Fragment>
        );
    },

    clear(props, store) {
        clearInterval(store.get('timer'));
    }

});