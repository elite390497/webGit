<template>
    <div style="width: 100vw; min-height: 100vh; background: #000000; padding:20px;">
        <div v-if="is_duplicate">
            <p>
                {{trans('communication.duplicate_tab')}}
            </p>
        </div>
        <div v-else>
            <vue-scroll :ops="scrollOptions">
                <div style="padding: 10px 20px; background: #171A23;">
                    <div class="d-flex">
                        <p class="mr-auto p-1" style="color: #AEB5C0; padding:0; margin:0;">
                            {{meeting.title}}
                            <span class="ml-2 label label-success" v-if="meeting.is_live">{{trans('communication.live')}}</span>
                            <span class="ml-2 label label-danger" v-if="meeting.is_expired">{{trans('communication.expired')}}</span>
                        </p>
                        <div class="p-1">
                        </div>
                        <div class="p-1">
                            <span class="icon custom-button" @click="$router.push('/communication/meeting/' + meeting.uuid)" v-tooltip="trans('communication.back_to_meeting')"><i class="fa fa-arrow-circle-left"></i></span>
                        </div>
                    </div>
                </div>

                <div class="container-fluid">

                    <div class="row mt-3" v-if="meeting.is_live">
                        <div class="col" v-if="! is_joined">
                            <button class="btn btn-block btn-success" @click="join">{{trans('communication.join_meeting')}}</button>
                        </div>
                        <div class="col" v-if="is_joined && can_share_screen">
                            <button class="btn btn-block btn-info" v-if="! is_screen_shared" @click="share">{{trans('communication.share_screen')}}</button>
                            <button disabled class="btn btn-block btn-info" v-if="is_screen_shared">{{trans('communication.stop_share_screen')}}</button>
                        </div>
                        <div class="col" v-if="is_joined">
                            <button class="btn btn-block btn-danger" @click="leave">{{trans('communication.leave_meeting')}}</button>
                        </div>
                    </div>

                    <div style="display: flex; height: auto; flex-wrap: wrap; justify-content: flex-start; margin-top:10px; ">
                        <div class="video-item mr-1" style="flex: 1 0 49.5%;">
                            <vue-scroll :ops="scrollOptions">
                                <p>{{trans('communication.meeting_start_time')}}: {{meeting.date | moment}} {{meeting.start_time | momentTime}}</p>
                                <p>{{trans('communication.meeting_end_time')}}: {{meeting.date | moment}} {{meeting.end_time | momentTime}}</p>
                                <div v-if="attachments.length">
                                    <ul class="m-t-10 upload-file-list">
                                        <li class="upload-file-list-item" v-for="attachment in attachments" :key="attachment.uuid">
                                            <a :href="`/communication/meeting/${meeting.uuid}/attachment/${attachment.uuid}/download?token=${authToken}`" class="no-link-color"><i :class="['file-icon', 'fas', 'fa-lg', attachment.file_info.icon]"></i> <span class="upload-file-list-item-size">{{attachment.file_info.size}}</span> {{attachment.user_filename}}</a>
                                        </li>
                                    </ul>
                                </div>
                                <div v-html="meeting.description">
                                </div>
                            </vue-scroll>
                        </div>

                        <template v-if="! meeting.is_live && ! meeting.is_expired">
                            <div class="video-item" style="flex: 1 0 49.5%;">
                                <p class="text-center">{{trans('communication.meeting_scheduled', {date: formatDate(meeting.date), time: formatTime(meeting.start_time)})}}</p>
                            </div>
                        </template>
                        <template v-if="meeting.is_expired">
                            <div class="video-item" style="flex: 1 0 49.5%;">
                                <p class="text-center">{{trans('communication.meeting_ended', {date: formatDate(meeting.date), time: formatTime(meeting.end_time)})}}</p>
                            </div>
                        </template>
                        <template v-if="meeting.is_live">
                            <div class="video-item" style="flex: 1 0 49.5%;" v-if="!is_joined">
                                <p class="text-center">{{trans('communication.join_meeting_instruction')}}</p>
                            </div>
                            <template v-if="is_joined">
                                <div v-for="(item, index) in orderedVideoList" :key="item.id" :class="['video-item', index === 0 || screen_width <= 768 ? 'video-maximized' : 'video-minimized', item.maximized ? 'maxmized' : '' ]">
                                    <video autoplay ref="videos" :height="index === 0 ? maximizeVideoHeight : minimizeVideoHeight" playsinline :muted="item.muted" :id="item.id"></video>
                                    <p class="mt-3">
                                        {{item.fullName}} <span v-if="item.screenSharing">{{(trans('communication.screen'))}}</span>
                                        <span v-if="item.maximized != -1" class="ml-2 custom-button" @click="highlight(item)"><i class="fas fa-expand-arrows-alt"></i></span> 
                                        <span v-if="index === 0" class="ml-2 custom-button" @click="fullScreen(item)"><i class="fas fa-expand"></i></span> 
                                    </p>
                                </div>
                            </template>
                        </template>
                    </div>
                </div>
            </vue-scroll>
        </div>
  </div>
</template>

<script>
import RTCMultiConnection from 'rtcmulticonnection'
import 'adapterjs'

export default {
    components: {RTCMultiConnection},
    data() {
        return {
            uuid:this.$route.params.uuid,
            meeting: {},
            attachments: [],
            roomId: '',
            is_joined: false,
            is_duplicate: false,
            can_share_screen: false,
            is_screen_shared: false,
            screen_share_stream: {},
            socketURL: null,
            enableAudio: true,
            enableVideo: true,
            enableLogs: false,
            autoplay: true,
            cameraHeight: 160,
            rtcmConnection: null,
            localVideo: null,
            screen_width: window.innerWidth,
            videoList: [],
            canvas: null,
            is_owner: false,
            scrollOptions: {
                vuescroll: {
                    mode: 'native',
                },
                bar: {
                    background: '#171A23'
                }
            }
        }
    },
    mounted() {
        if(!helper.hasPermission('list-meeting')){
            helper.notAccessibleMsg();
            this.$router.push('/dashboard');
        }

        if (window.IsDuplicate()) {
            this.is_duplicate = true;
        }

        this.getMeeting();
    },
    beforeRouteLeave(to, from, next) {
        if (this.is_joined) {
            this.leave();
        }
        next()
    },
    methods: {
        getMeeting(){
            let loader = this.$loading.show();
            axios.get('/api/meeting/'+this.uuid + '?live=true')
                .then(response => {
                    this.meeting = response.meeting;
                    this.attachments = response.attachments;
                    this.socketURL = response.socket;

                    if (this.meeting.user_id === helper.getAuthUser('id')) {
                        this.is_owner = true;
                    }

                    const vm = this

                    this.rtcmConnection = new RTCMultiConnection()
                    this.rtcmConnection.socketURL = this.socketURL
                    this.rtcmConnection.autoCreateMediaElement = false
                    this.rtcmConnection.enableLogs = this.enableLogs
                    this.rtcmConnection.session = {
                        audio: this.enableAudio,
                        video: this.enableVideo
                    }
                    this.rtcmConnection.iceServers = response.ice_servers || [];

                    this.rtcmConnection.sdpConstraints.mandatory = {
                        OfferToReceiveAudio: this.enableAudio,
                        OfferToReceiveVideo: this.enableVideo
                    }
                    this.rtcmConnection.onstream = function(stream) {
                        let found = vm.videoList.find(video => {
                            return video.id === stream.streamid
                        })
                        if (found === undefined) {

                            let screenSharing = false;
                            if (stream.hasOwnProperty('stream')) {
                                if (stream.stream.isVideo === false && stream.stream.isAudio === false) {
                                    screenSharing = true;
                                }
                            }

                            let video = {
                                id: stream.streamid,
                                muted: stream.type === 'local',
                                fullName: stream.extra.fullName,
                                userUuid: stream.extra.userUuid,
                                screenSharing: screenSharing,
                                isOwner: stream.extra.isOwner,
                                maximized: vm.videoList.length === 0 ? -1 : stream.extra.maximized,
                            }

                            let idx = vm.videoList.findIndex(o => {
                                return o.userUuid === video.userUuid && o.screenSharing === video.screenSharing
                            })
                            if (idx >= 0) {
                                vm.videoList.splice(idx, 1);
                            }

                            if (video.screenSharing && video.userUuid === helper.getAuthUser('uuid')) {
                                
                            } else {
                                if (vm.meeting.audience_video_preference) {
                                    if ((vm.is_owner) || (! vm.is_owner && (video.isOwner || video.userUuid === helper.getAuthUser('uuid')))) {
                                        vm.videoList.push(video)
                                    }
                                } else {
                                    vm.videoList.push(video)
                                }
                            }

                            if (stream.type === 'local') {
                                video.maximized = -1
                                vm.localVideo = video
                            }
                        }

                        setTimeout(function() {
                            if (vm.$refs.hasOwnProperty('videos')) {
                                for (let i = 0, len = vm.$refs.videos.length; i < len; i++) {
                                    if (vm.$refs.videos[i].id === stream.streamid) {
                                        vm.$refs.videos[i].srcObject = stream.stream
                                        break
                                    }
                                }
                            }
                        }, 1000)
                    }
                    this.rtcmConnection.onstreamended = function(stream) {
                        vm.videoList = vm.videoList.filter(o => o.id != stream.streamid)
                    }

                    loader.hide();
                })
                .catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                    this.$router.push('/communication/meeting');
                })
        },
        highlight(item) {
            this.videoList.forEach(v => {
                v.maximized = v.id === item.id ? -1 : 0
            })
        },
        join() {
            let loader = this.$loading.show();
            axios.post('/api/meeting/'+this.uuid+'/join')
                .then(response => {
                    this.roomId = response.code;

                    if (! this.roomId) {
                        toastr.error(i18n.general.something_wrong);
                        loader.hide();
                        return;
                    }

                    const vm = this
                    this.rtcmConnection.extra = {
                        fullName: helper.getAuthUser('name'),
                        userUuid: helper.getAuthUser('uuid'),
                        isOwner: this.is_owner ? true : false,
                        maximized: 0
                    }
                    this.rtcmConnection.openOrJoin(this.roomId, function(isRoomExist, roomid) {
                        if (isRoomExist === false && vm.rtcmConnection.isInitiator === true) {
                        }
                        vm.is_joined = true;

                        if (vm.meeting.user_id == helper.getAuthUser('id')) {
                            vm.can_share_screen = true;
                        }
                    })

                    loader.hide();
                })
                .catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                })
        },
        leave() {
            let loader = this.$loading.show();
            axios.post('/api/meeting/'+this.uuid+'/leave')
                .then(response => {
                    if (this.is_joined) {
                        this.rtcmConnection.attachStreams.forEach(function(localStream) {
                            localStream.stop()
                        })
                        this.videoList = []
                        this.is_joined = false;
                    }
                    loader.hide();
                })
                .catch(error => {
                    loader.hide();
                    helper.showErrorMsg(error);
                })
        },
        share() {
            var vm = this;
            if (navigator.getDisplayMedia || navigator.mediaDevices.getDisplayMedia) {
                function addStreamStopListener(stream, callback) {
                    var streamEndedEvent = 'ended';
                    if ('oninactive' in stream) {
                        streamEndedEvent = 'inactive';
                    }
                    stream.addEventListener(streamEndedEvent, function() {
                        callback();
                        callback = function() {};
                    }, false);
                }

                function onGettingSteam(stream) {
                    stream.screenSharing = true
                    vm.rtcmConnection.addStream(stream);
                    vm.screen_share_stream = stream;
                    vm.is_screen_shared = true;

                    addStreamStopListener(stream, function() {
                        vm.rtcmConnection.removeStream(stream.streamid);
                        vm.is_screen_shared = false;
                    });
                }

                function getDisplayMediaError(error) {
                    console.log('Media error: ' + JSON.stringify(error));
                }

                if (navigator.mediaDevices.getDisplayMedia) {
                    navigator.mediaDevices.getDisplayMedia({video: true, audio: false}).then(stream => {
                    onGettingSteam(stream);
                    }, getDisplayMediaError).catch(getDisplayMediaError);
                }
                else if (navigator.getDisplayMedia) {
                    navigator.getDisplayMedia({video: true}).then(stream => {
                    onGettingSteam(stream);
                    }, getDisplayMediaError).catch(getDisplayMediaError);
                }
            }
        },
        logEvent(event) {},
        formatDate(date) {
            return helper.formatDate(date)
        },
        formatTime(date) {
            return helper.formatTime(date)
        },
        fullScreen(item) {
            let elem = document.getElementById(item.id);
            if (elem.requestFullscreen) {
                elem.requestFullscreen();
            } else if (elem.mozRequestFullScreen) {
                elem.mozRequestFullScreen();
            } else if (elem.webkitRequestFullscreen) {
                elem.webkitRequestFullscreen();
            } else if (elem.msRequestFullscreen) {
                elem.msRequestFullscreen();
            }
        }
    },
    filters: {
        moment(date) {
            return helper.formatDate(date);
        },
        momentDateTime(date) {
            return helper.formatDateTime(date);
        },
        momentTime(time) {
            return helper.formatTime(time);
        }
    },
    computed: {
        authToken(){
            return helper.getAuthToken();
        },
        isDemo() {
            return ! helper.getConfig('mode') ? true : false;
        },
        maximizeVideoHeight() {
            if (this.screen_width < 400) {
                return 180;
            } else if (this.screen_width < 640) {
                return 220;
            } else if (this.screen_width <= 768) {
                return 360;
            } else {
                return 400;
            }
        },
        minimizeVideoHeight() {
            if (this.screen_width < 400) {
                return 180;
            } else if (this.screen_width < 640) {
                return 220;
            } else if (this.screen_width <= 768) {
                return 360;
            } else {
                return 220;
            }
        },
        orderedVideoList() {
            let arr = this.videoList
            arr.sort(function(a, b) {
                var keyA = new Date(a.maximized),
                    keyB = new Date(b.maximized);
                if (keyA < keyB) return -1;
                if (keyA > keyB) return 1;
                return 0;
            });

            return arr;
        }
    }
}
</script>

<style scoped>
    .icon {
        margin-right: 10px;
    }
    @media (max-width: 991px) {
        .col-t-m {
            margin: 4px 0;
        }
    }
    .video-item {
        display: flex; 
        flex-direction: column; 
        align-items: center; 
        justify-content: space-around; 
        align-self: stretch;
        background: #171A23; 
        padding: 10px 20px;
        margin-top: 0.25rem !important;
        margin-right: 0.25rem !important;
    }
    .video-maximized {
        flex: 1 0 49.5%;
    }
    .video-minimized {
        padding-top: 20px;
        flex: 0 0 19.7%;
    }
    .maximized {
        order: -1;
    }
</style>