// import $ from 'jquery' 

$(function () {

    var latelyItems = null

    function playData(imgurl, name, songer) {
        //添加播放栏信息
        $('.footer-bottom-left').find('img').attr('src', imgurl);
        $('.songName1').text(name);
        $('.songName2').text(songer)

    }

    //推荐歌单
    function centerRecommend() {
        //     音乐库-推荐歌单
        //      http://www.arthurdon.top:3000/personalized?id=3029284058

        // 获取歌单ID
        var centerListList = $('#center-list-lists');

        var stat = 0//开始截取
        var end = 12//终止截取

        var isHas = true//判断是否加载完

        function fun1(data) {
            $.each(data, function (i, v) {

                //获取歌单列表图片
                var SongsListUrl = data[i].picUrl

                //获取歌单名字
                var SongsListName = data[i].name

                //播放次数
                var SongsListplayCount = (data[i].playCount / 1000).toFixed(1)

                SongsListplayCount = SongsListplayCount / 1000 >= 1 ? (SongsListplayCount / 1000).toFixed(1) + '亿' : SongsListplayCount + '万'

                //获取歌单列表ID
                var SongsListId = data[i].id

                // console.log("SongsListId==>",SongsListId)

                var recommendSongs = $(`<div class="list-lists-child" data-id="${SongsListId}">
                    <div class="lists-img-box">
                    <div class="lists-img">
                        <img class="auto-img" src="${SongsListUrl}">
                        <div class="lists-vv-box">
                            <div class="lists-vv">${SongsListplayCount}</div>
                            <span></span>
                        </div>
                    </div>
                    </div>
                    <div class="lists-name towTextOverflow">${SongsListName}</div>
                    </div>
                    `)
                $('.center-list-lists').append(recommendSongs)

            })
        }

        var centerListLists = localStorage.getItem('centerListLists');

        //如果不存在缓存数据,发起ajax请求
        if (!centerListLists) {
            $('.prompt').show();
            console.log('不存在缓存数据');
            $.ajax({
                type: "GET",
                url: 'http://www.arthurdon.top:3000/personalized',

                isAsync: true,//异步程序设置为同步程序执行

                success: function (data) {

                    console.log('data==>', data)
                    //加载数据
                    // fun1(data)
                    //将数据缓存在浏览器的本地存储 localStorage
                    localStorage.setItem('centerListLists', JSON.stringify(data));

                    centerListLists = data

                    fun1(data.result.slice(stat, stat + end))

                    stat += end
                    $('.prompt').hide()
                },
                error: function (err) {
                    // 请求失败
                    console.log("err==>", err)
                }
            })
        } else {
            centerListLists = JSON.parse(centerListLists)
            fun1(centerListLists.result.slice(stat, stat + end))
            stat += end
        }

        //滚动预加载与防抖动
        var timers = [];
        $('center').scroll(function () {
            if (!isHas) {
                console.log('没了')
                return
            }
            var timer = setTimeout(function () {

                for (var i = 0; i < timers.length; i++) {
                    clearTimeout(timers[i])
                }

                var centerHeight = $('center').height()
                // console.log('centerHeight==>',centerHeight)

                var centerListListsLastTop = $('.center-list-lists').children().last().offset().top;
                // console.log('centerListListsLastTop',centerListListsLastTop)

                var centerListListsLastHeight = $('.center-list-lists').children().last().height();
                // console.log('centerListListsLastHeight',centerListListsLastHeight)

                var centerLbt = $('.center-lbt').height()
                // console.log('centerLbt==>',centerLbt)

                var centerBottom = $('.center-bottom').height()
                // console.log('centerBottom==>',centerBottom)

                var centerList = $('.center-list').height()
                // console.log('centerList==>',centerList)

                var scrollTop = $("center").scrollTop()

                // 预加载
                var yupan = 100

                if (centerHeight - centerListListsLastHeight + centerLbt + centerList + yupan > centerListListsLastTop + centerLbt) {

                    //获取推荐歌单列表
                    var centerRecommends = centerListLists.result
                    // console.log("recommendSongsLists==>", recommendSongsLists)

                    fun1(centerRecommends.slice(stat, stat + end))

                    stat += end

                    //如果歌单数量不够12条就判断后面没有数据加载
                    if (centerRecommends.lenght < end) {
                        isHas = false
                        console.log('没数据了')
                    }
                }

                timers = []
            }, 500)
            timers.push(timer)
        })
    }
    centerRecommend()

    //歌单所有歌曲
    function centerRecommendSongsList() {

        var audio = $('#audio')[0]

        var stat1 = 0
        var end1 = 15
        var isHas1 = true

        function fun2(playlistsongname) {

            $.each(playlistsongname, function (i, v) {

                var div = $(`<div class="menu-center clearfix" data-name="${v.name}" data-play="0" data-songer="${v.ar[0].name}" data-dt="${v.dt}" data-id="${v.id}" data-imgUrl="${v.al.picUrl}">
                        
                        <i class="border-left fl"></i>
                        <div class="menu-center-fl fl clearfix" data-act='0'>
                            <i class="fl tj"></i>
                            <div class="menu-center-song fl">
                                <div class="menu-center-songName oneTextOverflow">${v.name}</div>
                                <div class="menu-center-songer oneTextOverflow">${v.ar[0].name}</div>
                            </div>
                        </div>
                        <div class="menu-center-fr fr clearfix">
                            <i></i>
                            <i></i>
                        </div>
                    </div>`)

                $('.songsList-menu-center').append(div)

            })
        }

        // 点击歌单获取所有歌曲
        $('.center-list-lists').on('click', '.list-lists-child', function () {

            // 获取歌单id
            var listsID = $(this).data('id')
            console.log('listsID==>', listsID)
            $('.center-recommend-songsList').data('id', listsID)

            //存储所有歌单
            var playlistsongname = undefined

            //点击歌单显示全部歌曲
            $('.center-recommend').hide()
            $('.center-recommend-songsList').show()

            //加载页面显示
            $('.prompt').show();
            //请求数据获取所有歌曲
            $.ajax({
                type: 'GET',
                url: 'http://www.arthurdon.top:3000/playlist/detail?id=' + listsID,
                // dataType: 'jsonp',
                success: function (data2) {
                    console.log("data2==>", data2)
                    console.log("data2.playlist==>", data2.playlist)
                    //加载页面隐藏
                    $('.prompt').hide()

                    //获取歌单的所有歌曲
                    playlistsongname = data2.playlist.tracks
                    console.log("playlistsongname==>", playlistsongname)

                    //缓存当前数据
                    localStorage.setItem('playlistsongnameList', JSON.stringify(playlistsongname))

                    fun2(playlistsongname)

                    //获取专辑名
                    var playlistname = data2.playlist.name
                    $('.details-matter-name').text(playlistname)

                    //获取专辑人名字
                    var playlistsongnickname = data2.playlist.creator.nickname
                    $('.details-matter-songname').text(playlistsongnickname)

                    // 获取专辑人图片
                    var playlistsongavatarUrl = data2.playlist.creator.avatarUrl
                    $('.details-matter-img').attr('src', playlistsongavatarUrl)

                    // 歌曲数量
                    $('.songsList-menu-icon').find('span').text(playlistsongname.length)

                    // 获取播放时的ID
                    var footerId = $('.footer-bottom').data('id')

                    //监听实时播放歌曲
                    if (footerId != undefined) {
                        $.each(playlistsongname, function (v, i) {
                            if (footerId == i.id) {
                                var aa = $('.songsList-menu-center').children()
                                $(aa[v]).find('.border-left').css('opacity', 1)
                                return false
                            }
                        })
                    }

                }
            })

        })

        //保存最近播放列表
        var arr = null;
        var latelyItem = []

        //点击激活歌曲，获取歌曲信息
        $('.songsList-menu-center').on('click', '.menu-center', function () {

            var musicId = $(this).data("id")

            console.log('musicId', musicId)
            var self = this
            // 0:为播放状态 1：为停止状态
            var playStat = $(this).data('play');
            if ($(this).hasClass('activeChild')) {

                if (playStat == 0) {

                    audio.pause()
                    $(this).data('play', 1)
                    console.log('停止')
                    $('#audio').data('play', 0)

                } else {
                    audio.play()
                    $(this).data('play', 0)
                    $('#audio').data('play', 1)
                    console.log('播放')
                }
            } else {
                //播放歌曲
                //获取歌曲的ID
                //获取歌曲链接
                var musicUrls = null;

                $('.menu-center').removeClass('activeChild').find('.border-left').css('opacity', 0)

                $.ajax({
                    type: 'GET',
                    url: 'http://www.arthurdon.top:3000/song/url',
                    data: {
                        id: musicId,
                    },
                    async: false,
                    success: function (musicUrl) {
                        // console.log('musicUrl==>', musicUrl)

                        //获取歌曲的id
                        musicUrls = musicUrl.data[0].url
                        console.log('musicUrls==>', musicUrls)

                        //将歌曲链接传给播放器
                        $('audio').attr('src', musicUrls)
                        $(self).addClass('activeChild').find('.border-left').css('opacity', 1).data('play', '1')
                        console.log($(self))
                    }
                })

                //添加播放栏信息

                // playData($(this), $(this).data('imgurl'),$(this).data('name'),$(this).data('songer'))

                $('.footer-bottom-left').find('img').attr('src', $(this).data('imgurl'))
                $('.songName1').text($(this).data('name'))
                $('.songName2').text($(this).data('songer'))

                $('.footer-bottom')
                    .data('img', $(this).data('imgurl'))
                    .data('songName2', $(this).data('name'))
                    .data('songName1', $(this).data('songer'))
                    .data('id', $(this).data('id')).data('dt', $(this).data('dt'))

                $('#audio').data('play', '1')

                //获取所点击的歌曲信息
                arr = {
                    img: $(this).data('imgurl'),
                    songName1: $(this).data('name'),
                    songName2: $(this).data('songer'),
                    songId: $(this).data('id'),
                    songDt: $(this).data('dt'),
                    songUrl: musicUrls
                }

                var arrsong = arr.songId
                //判断点击的歌曲ID是否重复，是则截取重复出现的上一条删除，再次添加到本地存储里
                $.each(latelyItem, function (i, v, arr) {
                    if (v.songId == arrsong) {
                        latelyItem.splice(i, 1)
                        return false
                    }
                })
                latelyItem.push(arr)
            }
            console.log('latelyItem', latelyItem)
            //将数据缓存在浏览器的本地存储 localStorage
            localStorage.setItem('latelyItem', JSON.stringify(latelyItem));


            // 获取本地随机播放歌曲
            latelyItems = JSON.parse(localStorage.getItem('latelyItem'))
        })

        $('.prompt').hide();

        //点击歌单的返回按钮返回主页
        $('.songsList-title>i').on('click', function () {
            //点击歌单显示全部歌曲
            $('.center-recommend').show()
            $('.center-recommend-songsList').hide()
            $('.songsList-menu-center').empty()

        })

        //存储下一曲的下标
        let xiabiao = 0;
        // 切换下一首歌曲
        $('.footer-bottom-right-next').on('click', function () {

            let soonged = JSON.parse(localStorage.getItem('playlistsongnameList'))
            console.log('下一首')
            console.log('soonged 菜单', soonged)
            soonged.forEach((i, k) => {
                if (i.id == $('.footer-bottom').data('id')) {
                    k + 1
                    xiabiao = k + 1
                    console.log('下一首信息', soonged[xiabiao])

                    let url = null
                    $.ajax({
                        type: 'GET',
                        url: 'http://www.arthurdon.top:3000/song/url',
                        data: {
                            id: soonged[xiabiao].id,
                        },
                        async: false,
                        success: function (musicUrl) {
                            // console.log('musicUrl==>', musicUrl)
                            //获取歌曲的id
                            url = musicUrl.data[0].url

                            console.log('url==>', url)
                            //将歌曲链接传给播放器
                            $('audio').attr('src', url)

                            // $(self)
                            return url
                        }
                    })
                    console.log('urlasdasdas==>', url)
                    playData(url, soonged[xiabiao].al.picUrl, soonged[xiabiao].name)

                    $('.footer-bottom-left').find('img').attr('src', soonged[xiabiao].al.picUrl)
                    $('.songName1').text(soonged[xiabiao].name)
                    $('.songName2').text(soonged[xiabiao].ar[0].name)

                    $('.footer-bottom')
                        .data('img', soonged[xiabiao].al.picUrl)
                        .data('songName2', soonged[xiabiao].name)
                        .data('songName1', soonged[xiabiao].ar[0].name)
                    let xx = $('.songsList-menu-center').children()
                    console.log('asd', $('.songsList-menu-center').children())
                    for (let i = 0; i < xx.length; i++) {
                        // console.log($('.songsList-menu-center').children()[i].)
                        // $($('.songsList-menu-center').children()[xiabiao]).addClass('activeChild')
                    }

                    $('#audio').data('play', '1')
                    console.log('xiabiao', xiabiao)
                }

            })


        })
    }
    centerRecommendSongsList()

    // 歌曲可以播放时触发
    $('#audio').on('canplay', function () {
        this.play()
        this.volume = 0.05
        // animation-play-state:running
        //paused:停止动画
        //running:执行动画

        // data-play:0 停止
        // data-play:1 播放
        //音乐播放事件
        $('#audio').on('play', function () {
            $('.footer-bottom-right-play').css({
                backgroundImage: 'url(./icon/暂停.png)'
            })

            $('.footer-bottom-left>img').css({
                animationPlayState: 'running'
            })
        })

        //音乐停止事件
        $('#audio').on('pause', function () {
            $('.footer-bottom-right-play').css({
                backgroundImage: 'url(./icon/播放.png)'
            })
            $('.footer-bottom-left>img').css({
                animationPlayState: 'paused'
            })
        })

        //初始化歌词面板
        var footerBottom = $('.footer-bottom').data('id');
        $.ajax({
            type: 'GET',
            url: 'http://www.arthurdon.top:3000/lyric',
            data: {
                //歌曲id
                id: footerBottom
            },
            success: function (data) {

                console.log('歌词加载完毕');
                // attr('data-asa',2)

                //获取歌词
                var lrc = data.lrc.lyric

                lrc = lrc.split(/[\n\r]/);

                //去除最后一个空值
                lrc.splice(-1, 1);

                for (var i = 0; i < lrc.length; i++) {

                    var lrcItem = lrc[i].split(/\]/);
                    // console.log('lrcItem ==> ', lrcItem);

                    //当前歌词的时间
                    var songCt = lrcItem[0].slice(1);

                    //歌词时间
                    var time = songCt.split(/:/);

                    //获取分钟
                    var minute = Number(time[0]) * 60;

                    //获取秒钟
                    var second = Number(time[1]);

                    //当前歌词的时刻
                    var t0 = minute + second;

                    //创建歌词列表
                    var p = $(`<p name="${t0}">${lrcItem[1]}</p>`);
                    $('.play-lyric-box').append(p);
                }

            }
        })

        // 实现点击播放暂停按钮
        $('.footer-bottom-right-play').on('click', function () {

            if ($('#audio').data('play') == 0) {
                $('#audio').data('play', 1)
                audio.play()
                $(this).css({ backgroundImage: 'url(./icon/暂停.png)' }).find('img').css({ animationPlayState: 'running' })
            } else {
                $(this).css({ backgroundImage: 'url(./icon/播放.png)' }).find('img').css({ animationPlayState: 'paused' })
                audio.pause()
                $('#audio').data('play', 0)
            }
        })

        //点击歌词面板的播放与停止按钮互相切换，
        $('.play-icon2-play').click(function () {
            console.log('audio', $('#audio').data('play'))
            if ($('#audio').data('play') == 1) {
                $('#audio').data('play', 0)
                audio.pause()
                $(this).css("backgroundImage", 'url(./icon/播放.png)')
            } else {
                $('#audio').data('play', 1)
                audio.play()
                $(this).css("backgroundImage", 'url(./icon/暂停.png)')
            }

        })

        // 获取正在播放的歌曲信息
        var playmessage = $('.footer-bottom').data()
        console.log('playmessage', playmessage)

        //修改歌词面板内容
        // 歌曲长度
        var songlength = formatTime(playmessage.dt)
        songlength = songlength == '0NaN:0NaN' ? '00:00' : songlength

        $('.play-artist').text(playmessage.songName1)
        $('.play-song').text(playmessage.songName2)
        $('.num2').text(songlength)
    })

    var isPlay = false
    var index = 0
    var playLyric = $('.play-lyric').width()
    var playLyricBox = parseFloat($('.play-lyric-box').css('top'))

    //监听歌词播放
    $('#audio').on('timeupdate', function () {

        if (isPlay) {
            return
        }
        var percent = null
        //滑动进度条事件
        function touch(e) {

            e.preventDefault();

            var slidingx = e.targetTouches[0].pageX - 47;

            console.log('boundWidth', boundWidth)
            var x = slidingx < 0 ? 0 : slidingx > boundWidth ? boundWidth : slidingx

            $('.sliding').css('left', x)
            $('.noactivate').width(x)

            percent = x / boundWidth
        }
        //获取绑定事件层的宽度
        var boundWidth = $('.bound').width() - 5;
        //获取未激活的宽度
        var noactivateWidth = $('.noactivate').width()

        // 移动端按下未抬起事件
        $('.bound').on('touchstart', function (e) {
            touch(e)
            isPlay = true
        })

        // 移动端滑动事件
        $('.bound').on('touchmove', function (e) {
            touch(e)
        })

        // 移动端按下并抬起事件
        $('.bound').on('touchend', function () {
            //清除抬起后滑动事件
            $(this).off('touchmove')

            isPlay = false

            var ct = audio.duration * percent

            audio.currentTime = ct
            var numtime1 = formatTime(ct * 1000)

            numtime1 = numtime1 == ' ' ? "00:00" : numtime1

            $('.num1').text(numtime1)
        })

        //监听获取播放时歌曲进度
        var duration = audio.duration
        // console.log('duration', duration)
        var time = audio.currentTime
        // console.log('time', time)

        $('.sliding').css('left', (time / duration) * boundWidth)
        $('.noactivate').width((time / duration) * boundWidth)
        var numtime2 = formatTime(time * 1000)

        $('.num1').text(numtime2)

        //歌词移动
        var $ps = $('.play-lyric-box>p');

        //获取p高度
        var pHeight = $($ps[0]).height();
        // console.log('pHeight ==> ', pHeight);

        if ($('.play-lyric-box>p').text == '') {
            $(this).remove()
        }

        for (var i = index; i < $ps.length; i++) {

            //获取当前p的时间
            var t1 = Number($($ps[i]).attr('name'));

            //获取下一个p时间
            //防止越界
            var t2 = 0;
            if ($ps[i + 1]) {
                t2 = Number($($ps[i + 1]).attr('name'));
            } else {
                t2 = Number.MAX_VALUE;
            }

            //如果满足条件，歌词处于 $ps[i]
            if (time >= t1 && time < t2) {

                index = i;

                $($ps[i]).addClass('active').prev().removeClass('active');

                //play-lyric-box移动top
                var top = playLyricBox - pHeight * i - 15;
                // console.log('top ==> ', top);

                $('.play-lyric-box').animate({
                    top: top + 'px'
                }, 1)

                break;
            }

        }

    })

    //刷新自动删除本地存储的内容
    localStorage.clear();

    //最近播放栏
    function lately() {
        //点击显示播放栏
        var latelyBtn = $('.footer-bottom-right').children().last()

        //点击激活最近播放列表的歌曲
        $('.lately-box-bottom').on("click", '.lately-list', function () {

            if ($('audio').attr('src') != $(this).data('songurl')) {
                //将歌曲链接传给播放器
                $('audio').attr('src', $(this).data('songurl'))
            } else {
                if ($('#audio').data('play') == 1) {
                    audio.pause()
                    $('#audio').data('play', 0)
                } else {
                    audio.play()
                    $('#audio').data('play', 1)
                }
            }

            //添加播放栏信息
            $('.footer-bottom-left').find('img').attr('src', $(this).data('img'))
            $('.songName1').text($(this).data('songname1'))
            $('.songName2').text($(this).data('songname2'))

            // 激活播放最近列表
            $('.lately-list').find('.lately-num').show().find('.lately-img').hide()
            $(this).find('.lately-img').show()
            $(this).find('.lately-num').hide()
        })

        $('.lately-box-bottom').on("click", '.del', function (e) {

            e.stopPropagation()


            var songId = $(this).parents('.lately-list').attr('data-id')
            console.log('songId', songId)

            console.log('latelyItem', latelyItems)
            $.each(latelyItems, function (i, v) {
                if (songId == v.songId) {
                    console.log(i)
                    latelyItems.splice(1, 1)
                    console.log('latelyItems', latelyItems)
                    localStorage.setItem(latelyItems)

                    latelyItems = localStorage.getItem(latelyItems)
                    $(this).parents('.lately-list').remove()
                }
            })
            console.log('latelyItem', latelyItems)
        })

        $('.lately-box-bottom').on("click", 'span', function (e) {
            e.stopPropagation()
            var latelyindex = $(this).data('index')
            console.log('latelyindex', latelyindex)
            if ($(this).data('index') == 0) {
                $(this).data('index', 1)
                $($(this)[0]).css({ background: 'url(./icon/爱心1.png)no-repeat center center', backgroundSize: '.24rem .24rem' })
            } else {
                $(this).data('index', 0)
                $($(this)[0]).css({ background: 'url(./icon/爱心2.png)no-repeat center center', backgroundSize: '.24rem .24rem' })
            }
            console.log('latelyindex', latelyindex)
        })

        //点击显示最近播放列表
        latelyBtn.click(function () {

            console.log('latelyItems', latelyItems)

            $('.lately').show().animate({ top: 0 }, 500)

            latelyFun(latelyItems)

        })

        // 创建本地歌曲列表的歌曲
        function latelyFun(latelyItems) {

            var footerBottomImg = $('.footer-bottom-left').find('img').attr('src')
            // console.log('footerBottomImg', footerBottomImg)

            $.each(latelyItems, function (i, v) {
                var div = `<div class="lately-list clearfix" data-play='0' data-songUrl="${v.songUrl}" data-img="${v.img}" data-id='${v.songId} 'data-dt="${v.songDt}" data-songName1='${v.songName1}' data-songName2='${v.songName2}'>
                            <div class="lately-list-song fl">
                                <div class="lately-order fl">
                                    <div class="lately-num">${i + 1}</div>
                                    <div class="lately-img"><img class="auto-img" src="${v.img}"></div>
                                </div>
                                <div class="lately-song fl">
                                    <div class="lately-song-name oneTextOverflow">${v.songName1}</div>
                                    <div class="lately-song-singer oneTextOverflow">${v.songName2}</div>
                                </div>
                            </div>
                            <div class="lately-list-icon fr">
                                <i class="del"></i>
                                <span class='loving-heart' data-index='0'></span>
                            </div>
                        </div>`;
                $('.lately-box-bottom').append(div)

                if ($('.footer-bottom').data('id') == v.songId) {
                    var s = $('.lately-box-bottom').children().eq(i)
                    s.data('play', '1')

                    s.find('.lately-num').hide();
                    s.find('.lately-img').show()
                }
            })

        }

        //隐藏播放栏
        $('.lately').on('click', function (e) {
            var thisClick = e.target
            if (e.target == this) {
                $(this).animate({ top: '100%' }, 500, function () {
                    $(this).hide()
                    $('.lately-box-bottom').empty()
                })
            }
        })

        // var islatIcon = 0

        // $('.footer-bottom-right-next').click(function () {
        //     var songId = $('.footer-bottom').data('id')
        //     console.log('songId', songId)
        //     console.log('latelyItems.length', latelyItems.length)
        //     $.each(latelyItems, function (i, v) {
        //         if (islatIcon == 0) {
        //             if (songId == v.songId) {
        //                 $('.footer-bottom-img').attr('src',latelyItems[i+1].img)
        //                 $('.footer-bottom').data('dt',latelyItems[i+1].songDt).data('id',latelyItems[i+1].songId)

        //                 $('.songName1').text(latelyItems[i+1].songName1)

        //                 latelyItems[i+1].songName2
        //             }
        //         }
        //         console.log('v', v.songId)
        //     })
        //     console.log('latelyItem', latelyItems)

        // })

    }
    lately()

    // 播放歌词面板
    function playPage() {
        // 点击歌词面板返回键返回上一层
        $('.paly-return').click(function () {
            $('.play').animate({
                top: '100%'
            }, 1000, function () {
                $('.play').hide()
            })
        })
        // 点击播放状态栏头像显示歌词面板
        $('.footer-bottom-img').click(function () {
            $('.play').show().animate({
                top: '0'
            }, 1000)

        })
    }

    playPage()

    //格式化时间，接收一个单位毫秒的参数
    function formatTime(m) {
        //将毫秒转换为秒
        var second = Math.floor(m / 1000 % 60);

        second = second >= 10 ? second : '0' + second;

        //将毫秒转换为分钟
        var minute = Math.floor(m / 1000 / 60);

        minute = minute >= 10 ? minute : '0' + minute;

        return minute + ':' + second;
    }
})