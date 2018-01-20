import React, { Component } from "react";
import { View, ScrollView, Text, StatusBar, Vibration, Alert, Linking } from 'react-native';
import { List, ListItem, Button, normalize} from 'react-native-elements';
import { splitDue, getDayDiff, BASE_DATE, getPercentOverdue, addSuperMemo} from '../components/SM2';
import ActionButton from 'react-native-action-button';
import Icon from 'react-native-vector-icons/Ionicons';

import RNFetchBlob from 'react-native-fetch-blob';
const fs = RNFetchBlob.fs
const dirs = RNFetchBlob.fs.dirs

const decks = {
    'Am - Dad': [{words:['am', 'an'], files:[['s383.mp3'],['s238.mp3']]},{words:['and', 'end'], files:[['s582.mp3'],['s524.mp3']]},{words:['axe', 'x'], files:[['s611.mp3', 's92.mp3'],['s6.mp3', 's554.mp3']]},{words:['bad', 'bed'], files:[['s439.mp3', 's457.mp3'],['s328.mp3', 's167.mp3']]},{words:['bag', 'beg'], files:[['s403.mp3'],['s104.mp3']]},{words:['ban', 'bang'], files:[['s493.mp3'],['s98.mp3']]},{words:['band', 'bend'], files:[['s213.mp3'],['s519.mp3']]},{words:['bat', 'bet'], files:[['s532.mp3', 's36.mp3'],['s96.mp3', 's64.mp3']]},{words:['bath', 'bat'], files:[['s203.mp3'],['s532.mp3', 's36.mp3']]},{words:['bathe', 'bade'], files:[['s385.mp3'],['s511.mp3']]},{words:['bathe', 'baize'], files:[['s385.mp3'],['s586.mp3']]},{words:['bathe', 'bays'], files:[['s385.mp3'],['s456.mp3']]},{words:['beam', 'bean'], files:[['s568.mp3'],['s264.mp3']]},{words:['berth', 'bert'], files:[['s39.mp3'],['s520.mp3']]},{words:['berth', 'bird'], files:[['s39.mp3'],['s531.mp3']]},{words:['bib', 'beeb'], files:[['s327.mp3'],['s410.mp3']]},{words:['bid', 'bead'], files:[['s257.mp3'],['s9.mp3']]},{words:['bin', 'bean'], files:[['s323.mp3', 's148.mp3'],['s264.mp3']]},{words:['bin', 'bing'], files:[['s323.mp3', 's148.mp3'],['s431.mp3', 's136.mp3']]},{words:['bit', 'beat'], files:[['s281.mp3'],['s31.mp3']]},{words:['bitch', 'beach'], files:[['s440.mp3'],['s529.mp3']]},{words:['bitch', 'beech'], files:[['s440.mp3'],['s93.mp3']]},{words:['blame', 'blain'], files:[['s321.mp3'],['s366.mp3']]},{words:['bland', 'blend'], files:[['s69.mp3'],['s423.mp3']]},{words:['bonze', 'bongs'], files:[['s74.mp3'],['s404.mp3']]},{words:['boom', 'boon'], files:[['s25.mp3'],['s525.mp3']]},{words:['both', 'boat'], files:[['s376.mp3'],['s508.mp3']]},{words:['both', 'bode'], files:[['s376.mp3'],['s239.mp3']]},{words:['breathe', 'breed'], files:[['s269.mp3'],['s130.mp3']]},{words:['breathe', 'breeze'], files:[['s269.mp3'],['s528.mp3']]},{words:['breather', 'breeder'], files:[['s379.mp3'],['s407.mp3']]},{words:['britches', 'breeches'], files:[['s505.mp3'],['s172.mp3']]},{words:['bun', 'bung'], files:[['s114.mp3'],['s175.mp3']]},{words:['cam', 'can'], files:[['s223.mp3'],['s94.mp3']]},{words:['came', 'cane'], files:[['s159.mp3'],['s160.mp3']]},{words:['cattle', 'kettle'], files:[['s108.mp3'],['s139.mp3']]},{words:['chick', 'cheek'], files:[['s152.mp3'],['s119.mp3']]},{words:['chip', 'cheap'], files:[['s265.mp3'],['s341.mp3']]},{words:['cist', 'ceased'], files:[['s502.mp3'],['s541.mp3']]},{words:['clam', 'clan'], files:[['s56.mp3'],['s189.mp3']]},{words:['clan', 'clang'], files:[['s189.mp3'],['s217.mp3']]},{words:['clothe', 'close'], files:[['s109.mp3'],['s125.mp3']]},{words:['clothing', 'closing'], files:[['s80.mp3'],['s170.mp3']]},{words:['comb', 'cone'], files:[['s180.mp3'],['s306.mp3']]},{words:['cot', 'caught'], files:[['s156.mp3'],['s422.mp3']]},{words:['could', 'cooed'], files:[['s232.mp3', 's296.mp3'],['s338.mp3']]},{words:['crick', 'creek'], files:[['s43.mp3', 's164.mp3'],['s101.mp3', 's509.mp3']]},{words:['dab', 'deb'], files:[['s310.mp3'],['s95.mp3']]},{words:['dad', 'dead'], files:[['s585.mp3'],['s267.mp3']]},{words:['deaf', 'death'], files:[['s576.mp3', 's135.mp3'],['s460.mp3', 's307.mp3', 's184.mp3']]}],
    'Dean - Known': [{words:['death', 'dead'], files:[['s460.mp3', 's307.mp3', 's184.mp3'],['s267.mp3']]},{words:['death', 'debt'], files:[['s460.mp3', 's307.mp3', 's184.mp3'],['s569.mp3']]},{words:['deem', 'dean'], files:[['s342.mp3'],['s494.mp3']]},{words:['did', 'deed'], files:[['s237.mp3', 's514.mp3'],['s544.mp3']]},{words:['dime', 'dine'], files:[['s436.mp3'],['s483.mp3']]},{words:['din', 'dean'], files:[['s286.mp3'],['s494.mp3']]},{words:['din', 'ding'], files:[['s286.mp3'],['s446.mp3']]},{words:['dip', 'deep'], files:[['s271.mp3'],['s140.mp3']]},{words:['don', 'dawn'], files:[['s309.mp3'],['s29.mp3']]},{words:['don', 'dong'], files:[['s309.mp3'],['s133.mp3']]},{words:['duff', 'doth'], files:[['s48.mp3', 's89.mp3'],['s418.mp3']]},{words:['dumb', 'dun'], files:[['s100.mp3'],['s314.mp3']]},{words:['dun', 'dung'], files:[['s314.mp3'],['s71.mp3']]},{words:['ether', ' either'], files:[['s132.mp3'],[]]},{words:['ether', 'eater'], files:[['s132.mp3'],['s472.mp3']]},{words:['fad', 'fed'], files:[['s486.mp3', 's62.mp3'],['s27.mp3', 's347.mp3']]},{words:['faith', 'face'], files:[['s103.mp3'],['s204.mp3', 's262.mp3', 's512.mp3']]},{words:['faith', 'fade'], files:[['s103.mp3'],['s210.mp3']]},{words:['faith', 'fate'], files:[['s103.mp3'],['s67.mp3']]},{words:['fame', 'feign'], files:[['s392.mp3'],['s417.mp3']]},{words:['fan', 'fang'], files:[['s427.mp3'],['s177.mp3']]},{words:['fang', 'thang'], files:[['s177.mp3'],['s105.mp3']]},{words:['fief', 'thief'], files:[['s445.mp3'],['s61.mp3']]},{words:['fill', 'feel'], files:[['s18.mp3'],['s455.mp3']]},{words:['fin', 'thin'], files:[['s501.mp3', 's604.mp3', 's50.mp3'],['s490.mp3', 's340.mp3', 's225.mp3']]},{words:['firm', 'therm'], files:[['s344.mp3'],['s415.mp3']]},{words:['first', 'thirst'], files:[['s99.mp3', 's488.mp3', 's30.mp3'],['s371.mp3', 's274.mp3']]},{words:['fist', 'feast'], files:[['s75.mp3'],['s513.mp3']]},{words:['fit', 'feet'], files:[['s35.mp3'],['s277.mp3']]},{words:['flash', 'flesh'], files:[['s263.mp3'],['s47.mp3']]},{words:['flit', 'fleet'], files:[['s590.mp3'],['s22.mp3']]},{words:['foam', 'phone'], files:[['s449.mp3'],['s503.mp3']]},{words:['fought', 'thought'], files:[['s409.mp3', 's155.mp3'],['s523.mp3', 's173.mp3', 's363.mp3']]},{words:['fourth', 'force'], files:[['s23.mp3'],['s86.mp3', 's288.mp3']]},{words:['fourth', 'fort'], files:[['s23.mp3'],['s331.mp3']]},{words:['free', 'three'], files:[['s369.mp3', 's176.mp3', 's60.mp3', 's293.mp3'],['s413.mp3', 's206.mp3', 's38.mp3', 's579.mp3', 's424.mp3']]},{words:['freeze', 'threes'], files:[['s421.mp3', 's113.mp3', 's318.mp3', 's573.mp3'],['s539.mp3', 's298.mp3']]},{words:['fresh', 'thresh'], files:[['s474.mp3', 's244.mp3'],['s304.mp3', 's42.mp3']]},{words:['fret', 'threat'], files:[['s190.mp3', 's487.mp3'],['s297.mp3', 's122.mp3']]},{words:['frieze', 'threes'], files:[['s195.mp3'],['s539.mp3', 's298.mp3']]},{words:['frill', 'thrill'], files:[['s345.mp3', 's492.mp3'],['s70.mp3', 's351.mp3']]},{words:['fro', 'throw'], files:[['s161.mp3'],['s429.mp3', 's138.mp3']]},{words:['froze', 'throws'], files:[['s57.mp3', 's46.mp3'],['s599.mp3', 's353.mp3']]},{words:['full', 'fool'], files:[['s154.mp3'],['s253.mp3']]},{words:['furred', 'third'], files:[['s559.mp3'],['s593.mp3', 's191.mp3']]},{words:['game', 'gain'], files:[['s261.mp3'],['s308.mp3']]},{words:['gassed', 'guest'], files:[['s443.mp3'],['s373.mp3']]},{words:['gin', 'gene'], files:[['s299.mp3'],['s497.mp3']]},{words:['gleam', 'glean'], files:[['s301.mp3'],['s26.mp3']]},{words:['gnome', 'known'], files:[['s63.mp3'],['s391.mp3']]}],
    'Gong - Meme': [{words:['gone', 'gong'], files:[['s477.mp3'],['s311.mp3']]},{words:['grid', 'greed'], files:[['s117.mp3'],['s234.mp3']]},{words:['grim', 'grin'], files:[['s577.mp3'],['s395.mp3']]},{words:['grin', 'green'], files:[['s395.mp3'],['s437.mp3']]},{words:['growth', 'gross'], files:[['s28.mp3', 's448.mp3'],['s44.mp3', 's59.mp3']]},{words:['gum', 'gun'], files:[['s20.mp3'],['s87.mp3']]},{words:['had', 'head'], files:[['s430.mp3'],['s313.mp3']]},{words:['ham', 'hem'], files:[['s368.mp3'],['s33.mp3']]},{words:['hand', 'hanged'], files:[['s600.mp3'],['s295.mp3']]},{words:['hearth', 'heart'], files:[['s349.mp3'],['s224.mp3']]},{words:['heath', 'heat'], files:[['s220.mp3'],['s357.mp3']]},{words:['heather', 'header'], files:[['s367.mp3'],['s560.mp3']]},{words:['hid', 'heed'], files:[['s567.mp3'],['s245.mp3']]},{words:['hill', 'he\'ll'], files:[['s498.mp3'],['s375.mp3']]},{words:['hip', 'heap'], files:[['s572.mp3'],['s412.mp3']]},{words:['his', 'he\'s'], files:[['s355.mp3'],['s504.mp3']]},{words:['hit', 'heat'], files:[['s221.mp3'],['s357.mp3']]},{words:['home', 'hone'], files:[['s153.mp3'],['s420.mp3']]},{words:['hood', 'who\'d'], files:[['s566.mp3'],['s66.mp3']]},{words:['hun', 'hung'], files:[['s179.mp3'],['s11.mp3']]},{words:['hythe', 'hide'], files:[['s247.mp3'],['s17.mp3']]},{words:['ill', 'eel'], files:[['s123.mp3'],['s356.mp3']]},{words:['is', 'ease'], files:[['s151.mp3'],['s211.mp3']]},{words:['it', 'eat'], files:[['s408.mp3'],['s278.mp3']]},{words:['itch', 'each'], files:[['s165.mp3'],['s465.mp3']]},{words:['jam', 'gem'], files:[['s325.mp3'],['s377.mp3']]},{words:['keith', 'keyed'], files:[['s552.mp3'],['s562.mp3']]},{words:['kid', 'keyed'], files:[['s157.mp3'],['s562.mp3']]},{words:['kin', 'king'], files:[['s315.mp3'],['s468.mp3']]},{words:['kip', 'keep'], files:[['s289.mp3'],['s571.mp3']]},{words:['kith', 'kiss'], files:[['s124.mp3'],['s207.mp3']]},{words:['knit', 'neat'], files:[['s589.mp3'],['s219.mp3']]},{words:['knotty', 'naughty'], files:[['s536.mp3', 's230.mp3'],['s258.mp3', 's594.mp3']]},{words:['land', 'lend'], files:[['s142.mp3'],[]]},{words:['lathe', 'laid'], files:[['s128.mp3'],['s183.mp3']]},{words:['lathe', 'laze'], files:[['s128.mp3'],['s199.mp3']]},{words:['latter', 'letter'], files:[['s458.mp3'],['s178.mp3']]},{words:['lick', 'leak'], files:[['s52.mp3'],['s77.mp3']]},{words:['lip', 'leap'], files:[['s384.mp3'],['s146.mp3']]},{words:['lithe', 'lies'], files:[['s126.mp3'],['s254.mp3']]},{words:['loathe', 'load'], files:[['s402.mp3'],['s291.mp3']]},{words:['loathe', 'lows'], files:[['s402.mp3'],['s346.mp3']]},{words:['look', 'luke'], files:[['s362.mp3'],['s386.mp3']]},{words:['man', 'men'], files:[['s81.mp3'],['s364.mp3']]},{words:['manned', 'mend'], files:[['s24.mp3'],['s205.mp3']]},{words:['marry', 'merry'], files:[['s359.mp3', 's111.mp3'],['s433.mp3', 's282.mp3']]},{words:['mat', 'met'], files:[['s193.mp3'],['s85.mp3']]},{words:['math', 'mass'], files:[['s360.mp3'],['s491.mp3']]},{words:['math', 'mat'], files:[['s360.mp3'],['s193.mp3']]},{words:['meme', 'mean'], files:[['s73.mp3'],['s229.mp3']]}],
    'Meal - Sing': [{words:['mill', 'meal'], files:[['s570.mp3'],['s45.mp3']]},{words:['mitt', 'meet'], files:[['s591.mp3'],['s444.mp3']]},{words:['moth', 'moss'], files:[['s83.mp3', 's527.mp3'],['s162.mp3']]},{words:['mouth', 'mouse'], files:[['s196.mp3'],['s334.mp3']]},{words:['myth', 'miss'], files:[['s518.mp3'],['s348.mp3']]},{words:['north', 'norse'], files:[['s545.mp3', 's216.mp3'],['s414.mp3']]},{words:['not', 'nought'], files:[['s434.mp3'],['s442.mp3']]},{words:['oaf', 'oath'], files:[['s549.mp3', 's268.mp3'],['s201.mp3', 's606.mp3']]},{words:['pan', 'pang'], files:[['s399.mp3', 's200.mp3'],['s521.mp3']]},{words:['pan', 'pen'], files:[['s399.mp3', 's200.mp3'],['s40.mp3', 's118.mp3']]},{words:['pat', 'pet'], files:[['s305.mp3'],['s145.mp3']]},{words:['path', 'pass'], files:[['s451.mp3'],['s517.mp3']]},{words:['perth', 'purred'], files:[['s540.mp3'],['s275.mp3']]},{words:['perth', 'purse'], files:[['s540.mp3'],['s294.mp3', 's411.mp3']]},{words:['pick', 'peak'], files:[['s561.mp3'],['s565.mp3']]},{words:['pill', 'peel'], files:[['s401.mp3'],['s106.mp3']]},{words:['pin', 'ping'], files:[['s537.mp3'],['s543.mp3']]},{words:['pip', 'peep'], files:[['s432.mp3'],['s330.mp3']]},{words:['piss', 'peace'], files:[['s21.mp3'],['s49.mp3']]},{words:['piss', 'piece'], files:[['s21.mp3'],['s218.mp3']]},{words:['pit', 'peat'], files:[['s300.mp3'],['s7.mp3']]},{words:['pitch', 'peach'], files:[['s163.mp3'],['s158.mp3']]},{words:['pith', 'piss'], files:[['s485.mp3'],['s21.mp3']]},{words:['pond', 'ponged'], files:[['s284.mp3'],['s248.mp3']]},{words:['pull', 'pool'], files:[['s548.mp3'],['s405.mp3']]},{words:['pulled', 'pooled'], files:[['s79.mp3'],['s602.mp3']]},{words:['ran', 'rang'], files:[['s374.mp3'],['s10.mp3']]},{words:['risen', 'reason'], files:[['s476.mp3'],['s588.mp3']]},{words:['run', 'rung'], files:[['s463.mp3'],['s506.mp3']]},{words:['ruth', 'root'], files:[['s227.mp3'],['s84.mp3']]},{words:['sad', 'said'], files:[['s352.mp3'],['s426.mp3']]},{words:['same', 'sane'], files:[['s256.mp3'],['s605.mp3']]},{words:['sat', 'set'], files:[['s107.mp3'],['s149.mp3']]},{words:['sax', 'sex'], files:[['s542.mp3'],['s534.mp3']]},{words:['scam', 'scan'], files:[['s372.mp3'],['s609.mp3']]},{words:['scythe', 'side'], files:[['s475.mp3'],['s419.mp3']]},{words:['scythe', 'size'], files:[['s475.mp3'],['s58.mp3']]},{words:['seem', 'seen'], files:[['s453.mp3'],['s322.mp3']]},{words:['seethe', 'seas'], files:[['s102.mp3'],['s466.mp3']]},{words:['seethe', 'seed'], files:[['s102.mp3'],['s393.mp3']]},{words:['shall', 'shell'], files:[['s336.mp3'],['s16.mp3']]},{words:['sheathe', 'she\'s'], files:[['s88.mp3'],['s332.mp3']]},{words:['shin', 'sheen'], files:[['s553.mp3'],['s461.mp3']]},{words:['shit', 'sheet'], files:[['s188.mp3'],['s343.mp3']]},{words:['should', 'shoed'], files:[['s185.mp3'],['s171.mp3']]},{words:['sick', 'seek'], files:[['s339.mp3'],['s1.mp3']]},{words:['sill', 'seal'], files:[['s516.mp3'],['s285.mp3']]},{words:['sin', 'scene'], files:[['s596.mp3', 's251.mp3'],['s394.mp3']]},{words:['sin', 'seen'], files:[['s596.mp3', 's251.mp3'],['s322.mp3']]},{words:['sin', 'sing'], files:[['s596.mp3', 's251.mp3'],['s192.mp3', 's558.mp3', 's129.mp3']]}],
    'Sip - Thy': [{words:['sip', 'seep'], files:[['s574.mp3'],['s208.mp3']]},{words:['sit', 'seat'], files:[['s260.mp3'],['s302.mp3']]},{words:['skid', 'skied'], files:[['s110.mp3'],['s597.mp3']]},{words:['skim', 'scheme'], files:[['s563.mp3'],['s127.mp3']]},{words:['skim', 'skin'], files:[['s563.mp3'],['s147.mp3']]},{words:['skit', 'skeet'], files:[['s78.mp3'],['s290.mp3']]},{words:['slick', 'sleek'], files:[['s447.mp3'],['s8.mp3']]},{words:['slit', 'sleet'], files:[['s4.mp3'],['s564.mp3']]},{words:['soot', 'suit'], files:[['s12.mp3'],['s471.mp3']]},{words:['sooth', ' soothe'], files:[['s215.mp3'],[]]},{words:['soothe', 'sued'], files:[['s65.mp3'],['s462.mp3']]},{words:['soothe', 'sues'], files:[['s65.mp3'],['s243.mp3']]},{words:['spanned', 'spend'], files:[['s550.mp3'],['s72.mp3']]},{words:['sperm', 'spurn'], files:[['s187.mp3'],['s319.mp3']]},{words:['still', 'steel'], files:[['s246.mp3'],['s382.mp3']]},{words:['stun', 'stung'], files:[['s279.mp3'],['s292.mp3']]},{words:['sum', 'sun'], files:[['s556.mp3', 's350.mp3', 's535.mp3'],['s255.mp3']]},{words:['sun', 'sung'], files:[['s255.mp3'],['s250.mp3']]},{words:['swathe', 'suede'], files:[['s450.mp3'],['s91.mp3']]},{words:['tack', 'tech'], files:[['s90.mp3'],['s546.mp3']]},{words:['tamp', 'temp'], files:[['s194.mp3'],['s489.mp3']]},{words:['tamper', 'temper'], files:[['s592.mp3'],['s610.mp3']]},{words:['tan', 'tang'], files:[['s121.mp3'],['s141.mp3']]},{words:['tan', 'than'], files:[['s121.mp3'],['s252.mp3']]},{words:['team', 'teen'], files:[['s287.mp3'],['s507.mp3']]},{words:['tear', 'their'], files:[['s459.mp3'],['s551.mp3']]},{words:['tease', 'these'], files:[['s240.mp3'],['s202.mp3', 's358.mp3']]},{words:['teeth', ' teethe'], files:[['s381.mp3'],[]]},{words:['teethe', 'teas'], files:[['s283.mp3'],['s19.mp3']]},{words:['teething', 'teasing'], files:[['s406.mp3'],['s233.mp3']]},{words:['ten', 'then'], files:[['s499.mp3'],['s324.mp3']]},{words:['tenth', 'tense'], files:[['s273.mp3'],['s598.mp3']]},{words:['tenth', 'tent'], files:[['s273.mp3'],['s242.mp3']]},{words:['term', 'turn'], files:[['s452.mp3'],['s428.mp3']]},{words:['than', 'dan'], files:[['s252.mp3'],['s478.mp3']]},{words:['thank', 'sank'], files:[['s259.mp3'],['s15.mp3']]},{words:['thank', 'tank'], files:[['s259.mp3'],['s608.mp3']]},{words:['thaw', 'saw'], files:[['s601.mp3'],['s510.mp3', 's116.mp3']]},{words:['theme', 'deem'], files:[['s150.mp3'],['s342.mp3']]},{words:['theme', 'seam'], files:[['s150.mp3'],['s272.mp3']]},{words:['theme', 'seem'], files:[['s150.mp3'],['s453.mp3']]},{words:['theme', 'team'], files:[['s150.mp3'],['s287.mp3']]},{words:['then', 'den'], files:[['s324.mp3'],['s235.mp3']]},{words:['then', 'zen'], files:[['s324.mp3'],['s212.mp3']]},{words:['there', 'dare'], files:[['s479.mp3', 's320.mp3', 's361.mp3', 's335.mp3', 's53.mp3'],['s470.mp3', 's484.mp3', 's469.mp3']]},{words:['they', 'day'], files:[['s316.mp3', 's120.mp3'],['s416.mp3']]},{words:['they\'ll', 'dale'], files:[['s581.mp3'],['s249.mp3']]},{words:['thick', 'sick'], files:[['s473.mp3', 's144.mp3'],['s339.mp3']]},{words:['thick', 'tick'], files:[['s473.mp3', 's144.mp3'],['s214.mp3']]},{words:['thigh', ' thy'], files:[['s112.mp3'],[]]}],
    'Thigh - Youth': [{words:['thigh', 'die'], files:[['s112.mp3'],['s326.mp3']]},{words:['thigh', 'sigh'], files:[['s112.mp3'],['s137.mp3', 's398.mp3']]},{words:['thigh', 'tie'], files:[['s112.mp3'],['s168.mp3']]},{words:['thimble', 'symbol'], files:[['s32.mp3', 's584.mp3'],['s547.mp3']]},{words:['thin', 'din'], files:[['s490.mp3', 's340.mp3', 's225.mp3'],['s286.mp3']]},{words:['thin', 'sin'], files:[['s490.mp3', 's340.mp3', 's225.mp3'],['s596.mp3', 's251.mp3']]},{words:['thin', 'thing'], files:[['s490.mp3', 's340.mp3', 's225.mp3'],['s222.mp3', 's166.mp3']]},{words:['thin', 'tin'], files:[['s490.mp3', 's340.mp3', 's225.mp3'],['s435.mp3']]},{words:['thing', 'sing'], files:[['s222.mp3', 's166.mp3'],['s192.mp3', 's558.mp3', 's129.mp3']]},{words:['thong', 'song'], files:[['s236.mp3'],['s333.mp3']]},{words:['thorn', 'torn'], files:[['s34.mp3'],['s131.mp3']]},{words:['those', 'doze'], files:[['s228.mp3'],['s397.mp3']]},{words:['though', 'dough'], files:[['s97.mp3'],['s55.mp3']]},{words:['thought', 'sought'], files:[['s523.mp3', 's173.mp3', 's363.mp3'],['s583.mp3']]},{words:['thread', 'dread'], files:[['s533.mp3'],['s276.mp3']]},{words:['thread', 'tread'], files:[['s533.mp3'],['s270.mp3']]},{words:['three', 'tree'], files:[['s413.mp3', 's206.mp3', 's38.mp3', 's579.mp3', 's424.mp3'],['s329.mp3', 's538.mp3']]},{words:['thuds', 'suds'], files:[['s495.mp3'],['s482.mp3']]},{words:['thug', 'tug'], files:[['s134.mp3'],['s441.mp3']]},{words:['thumb', 'some'], files:[['s186.mp3', 's280.mp3'],['s464.mp3', 's400.mp3', 's76.mp3']]},{words:['thumb', 'sum'], files:[['s186.mp3', 's280.mp3'],['s556.mp3', 's350.mp3', 's535.mp3']]},{words:['thump', 'sump'], files:[['s522.mp3', 's82.mp3'],['s115.mp3']]},{words:['thy', 'die'], files:[['s198.mp3'],['s326.mp3']]},{words:['tick', 'teak'], files:[['s214.mp3'],['s197.mp3']]},{words:['till', 'teal'], files:[['s575.mp3'],['s226.mp3']]},{words:['time', 'tine'], files:[['s41.mp3'],['s481.mp3']]},{words:['tin', 'teen'], files:[['s435.mp3'],['s507.mp3']]},{words:['tin', 'ting'], files:[['s435.mp3'],['s312.mp3']]},{words:['tit', 'teat'], files:[['s396.mp3'],['s530.mp3']]},{words:['tithe', 'ties'], files:[['s555.mp3'],['s266.mp3']]},{words:['tizz', 'teas'], files:[['s603.mp3'],['s19.mp3']]},{words:['tizz', 'tease'], files:[['s603.mp3'],['s240.mp3']]},{words:['toe', 'though'], files:[['s13.mp3'],['s97.mp3']]},{words:['toes', 'those'], files:[['s378.mp3', 's467.mp3'],['s228.mp3']]},{words:['tome', 'tone'], files:[['s231.mp3'],['s209.mp3']]},{words:['ton', 'tongue'], files:[['s354.mp3'],['s51.mp3']]},{words:['tooth', 'toot'], files:[['s390.mp3', 's515.mp3'],['s580.mp3']]},{words:['track', 'trek'], files:[['s181.mp3'],['s454.mp3']]},{words:['truth', 'truce'], files:[['s387.mp3', 's480.mp3'],['s54.mp3', 's5.mp3']]},{words:['vat', 'vet'], files:[['s337.mp3'],['s0.mp3']]},{words:['win', 'wing'], files:[['s526.mp3'],['s607.mp3']]},{words:['with', 'whizz'], files:[['s365.mp3'],['s169.mp3']]},{words:['wood', 'wooed'], files:[['s14.mp3'],['s388.mp3']]},{words:['worth', 'word'], files:[['s380.mp3', 's496.mp3'],['s241.mp3']]},{words:['worth', 'worse'], files:[['s380.mp3', 's496.mp3'],['s425.mp3', 's595.mp3', 's557.mp3']]},{words:['would', 'wooed'], files:[['s174.mp3'],['s388.mp3']]},{words:['wraith', 'race'], files:[['s389.mp3'],['s578.mp3', 's2.mp3']]},{words:['wreathe', 'reed'], files:[['s303.mp3'],['s182.mp3', 's500.mp3']]},{words:['youth', 'use'], files:[['s68.mp3', 's3.mp3', 's37.mp3', 's587.mp3'],['s317.mp3', 's370.mp3']]}],
}

class Decks extends Component {
    constructor() {
        super();
        this.state = {
            noteList: [],
            isLoading: true
        };
        this.loadAllDecks = this.loadAllDecks.bind(this);
        this.listFiles = this.listFiles.bind(this);
        this.listDir = this.listDir.bind(this);
        this.firstSeed = this.firstSeed.bind(this);
        this.doSeed = this.doSeed.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
    }

    createDir() {
        return RNFetchBlob.fs.mkdir(`${dirs.DocumentDir}/MinPairs`)
                .then(() => {
                    console.log('OK')
                })
                .catch((err) => {
                    console.log('NG')
                })
    }

    listDir() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}`);
    }

    listFiles() {
        return RNFetchBlob.fs.ls(`${dirs.DocumentDir}/MinPairs`);
    }

    createNewDeck(deckName, content) {
        const newFileName = deckName + '.json';
        // Create a real file
        return 
            fs.createFile(`${dirs.DocumentDir}/MinPairs/${newFileName}`, '', 'utf8')
                .then(() => {
                    fs.writeFile(`${dirs.DocumentDir}/MinPairs/${newFileName}`, JSON.stringify(content), 'utf8')
                });
    }
    
    doSeed() {
        const TODAY = getDayDiff(BASE_DATE, new Date());
        return fs.unlink(`${dirs.DocumentDir}/MinPairs`) //when debug
        .then((v) => {
        return this.createDir()
            .then(() => {
                return Promise.all(
                    Object.keys(decks).map((k) => {
                        let newFileName = k + '.json';
                        let isActive = (k == 'Am - Dad') ? true : false;
                        let content = {isActive: isActive, note: decks[k].map(function(d) {return addSuperMemo(d,TODAY);})};
                        return fs.createFile(`${dirs.DocumentDir}/MinPairs/${newFileName}`, '', 'utf8')
                                    .then(() => {
                                        return fs.writeFile(`${dirs.DocumentDir}/MinPairs/${newFileName}`, JSON.stringify(content), 'utf8')
                                    }, (reason) => {
                                        console.log(reason);
                                    });
                    }))
            })
        });
    }
    firstSeed(isFirst) {
        if (isFirst) {
            return this.doSeed().then((val) => {return this.listFiles()});
        } else {
            return this.listFiles();
        }
    }

    loadAllDecks() {
        const TODAY = getDayDiff(BASE_DATE, new Date());
        this.listDir(dirs.DocumentDir)
            .then((files) => {
                // Check whether the 'MinPairs' folder exist or not.
                const filteredFiles = files.filter((name) => {
                    return name === 'MinPairs';
                });
                return this.firstSeed(filteredFiles.length === 0); })//if neccesary
                // return this.firstSeed(true); })
            .then((files) => {
                console.log(files);
                var contents = new Array(files.length);
                var isActive = new Array(files.length);
                Promise.all(files.map((file, index) => {
                    return fs.readFile(`${dirs.DocumentDir}/MinPairs/${file}`, 'utf8')
                        .then((content) => {
                            let json = JSON.parse(content);
                            let contentObject = json.note;
                            contents[index] = splitDue(contentObject, TODAY)[0];
                            isActive[index] = json.isActive;
                            console.log(splitDue(contentObject,TODAY));
                        }, (reason) => {
                            console.log(reason);
                        }).catch(err => {
                            console.log(err);
                        });
                })).then((values) => {
                    var noteList = files.map((file, index) => {
                        return {
                            fileName: file,
                            keywords: contents[index].slice(0, 3).map((c) => { return c.words[0]; }).join(', '),
                            due: contents[index].length,
                            isActive: isActive[index],
                        };
                    });
                    console.log('NOTELI')
                    console.log(noteList);
                    this.setState({
                        noteList: noteList,
                        isLoading: false
                    });
                }, (err) => { console.log(err); }).catch(reason => {
                    console.log(reason);
                });
            });
    }

    componentDidMount() {
        this.loadAllDecks();
    }

    handlePressItem(filename) {
        this.props.navigation.navigate('ShowDeck', { filename: filename });
    }

    toggleActive(filename, currentActive, index) {
        return fs.readFile(`${dirs.DocumentDir}/MinPairs/${filename}`, 'utf8')
            .then((content) => {
                let json = JSON.parse(content);
                json.isActive = !currentActive;
                console.log(json);
                return fs.writeFile(`${dirs.DocumentDir}/MinPairs/${filename}`, JSON.stringify(json), 'utf8');
            })
            .then(() => {
                let noteList =  this.state.noteList.splice(0);
                noteList[index].isActive = !currentActive;
                this.setState({
                    ...this.state,
                    noteList: noteList,
                });
            }).catch(err => {
                console.log(err);
            });
    }

    render() {
        var isLoading = this.state.isLoading;
        if (isLoading) {
            return (
                <View><Text>Loading...</Text></View>
            )
        }
        var noteList = this.state.noteList;
        var self = this;
        return (            
            <View style={styles.pageContainer}>
                <StatusBar
                    backgroundColor='#000000'
                    barStyle="light-content"
                />
                {/* <View style={styles.textContainer}>
                    <Text>Active?</Text>
                    <Text>DUE</Text>
                </View> */}
                <ScrollView style={styles.listContainer}>
                    <List containerStyle={{borderTopWidth:0, marginTop:0}}>
                        {
                            noteList.map((note, index) => {
                                return <ListItem
                                            key={note.fileName}
                                            title={note.fileName.slice(0, -5)}
                                            subtitle={note.isActive ? 'next pairs: ' + note.keywords : ''}
                                            onPress={note.isActive ? () => self.handlePressItem(note.fileName) : () => {}}
                                            containerStyle={styles.containerListItem}
                                            titleStyle={!note.isActive ? styles.listItemTitleStyle : styles.activeTitleStyle}
                                            leftIcon={note.isActive ? {name:'pause-circle-outline', color: GREEN} : {name:'play-circle-outline'}}
                                            leftIconOnPress={() => {
                                                this.toggleActive(note.fileName, note.isActive,index);
                                            }}
                                            badge={note.isActive ? { 
                                                    value: note.due, 
                                                    textStyle: { fontWeight:'bold', fontSize:10},
                                                    containerStyle: {
                                                        backgroundColor: GRAYD,
                                                        borderBottomLeftRadius:10,
                                                        borderBottomRightRadius:10,
                                                        borderTopLeftRadius:10,
                                                        borderTopRightRadius:10,
                                                    }} : {containerStyle: {backgroundColor:'#ffffff'}}}
                                            hideChevron={true}
                                        />
                            })
                        }
                    </List>
                </ScrollView>
                <ActionButton 
                    buttonColor={GREEN} 
                    buttonText='...'
                    buttonTextStyle={{fontWeight: '500'}}
                    onPress={() => {Linking.openURL('https://goo.gl/73jgFU');}}
                />
            </View>
        );
    }
}

const PURPLE='#7f47dd';
const GRAY='#f2f2f2';
const GRAYD='#cccccc';
const YELLOW='#fbb03b';
const GREEN='#22b573';
const GREENL='#95efc2';
const BG='#ffffff';

import { StyleSheet } from 'react-native';
const styles = StyleSheet.create({
    pageContainer: {
        flex: 1,
        backgroundColor: '#ffffff',
        justifyContent:'flex-start'
    },
    listContainer: {
        flex: 1,
        // backgroundColor: '',
        borderTopWidth: 0,
        borderBottomWidth:0,
    },
    firstText: {
        color: '#000000',
        fontSize: 15,
        fontWeight: '300',     
        borderBottomWidth: 0,  
    },
    textContainer: {
        flex: 1,
        flexDirection: 'row',
        height:10,
        // alignItems: 'stretch',
        justifyContent: 'space-between',
        marginRight:22, 
        marginLeft:22,
    },
    containerListItem: {
        borderWidth:10,
        borderColor: '#ffffff',
        // borderBottomWidth:0,
    },
    listItemTitleStyle: {
        fontSize:normalize(22),
    },
    activeTitleStyle: {
        fontSize:normalize(22),
        fontWeight: 'bold',
        color: GREEN,
    },
    actionButtonIcon: {
        fontSize: 20,
        height: 23,
        color: 'white',
    },
  });

export default (Decks);