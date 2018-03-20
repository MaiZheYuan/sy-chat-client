/**
 * Created by haibalai on 2017/9/12.
 */
import EventEmitter from 'wolfy87-eventemitter'
export const EventBus = {};

EventBus.bus= new EventEmitter();

/*设置远程cd,sdp*/
EventBus.setRemoteRtc = "getRemoteRtc";
/*本地cd,sdp生成完毕*/
EventBus.localRtcDone = "localRtcDone";

