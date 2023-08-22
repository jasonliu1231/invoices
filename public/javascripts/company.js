// $(async function () {
//     guidepreset("base");
//     let response = await fetch("/get/companyinfo");
//     let rst = await response.json();
//     info = rst[0];

//     $("#name").val(rst[0].name);
//     $("#personincharge").val(rst[0].personincharge);
//     $("#id").val(rst[0].unum);
//     $("#taxid").val(rst[0].taxid);
//     let addr = rst[0].companyaddress.split("/");
//     $("#cmp_postal").val(addr[0]);
//     $("#cmp_address").val(addr[1]);
//     addr = rst[0].connectionaddress.split("/");
//     $("#connection_postal").val(addr[0]);
//     $("#connection_address").val(addr[1]);
//     if (rst[0].companyaddress === rst[0].connectionaddress) {
//         $("#setaddress").attr("checked", true);
//         setaddr();
//     }
//     $("#tel").val(rst[0].tel);
//     $("#facsimilenumber").val(rst[0].facsimilenumber);
//     $("#email").val(rst[0].email);
//     $("#roleremark").val(rst[0].roleremark);
//     $("#custom_name").val(rst[0].customname);
//     $(`input[value=${rst[0].printtype || 1}]`).prop("checked", true);
//     if (!!rst[0].invoicetitleimage) {
//         $($("#cmp_img > img")[0]).attr("src", rst[0].invoicetitleimage);
//         $("#cmp_img input").hide();
//     }
//     if (rst[0].printtype == 1) {
//         $("#cmp_img").hide();
//         $("#custom_name").hide();
//     } else if (rst[0].printtype == 2) {
//         $("#custom_name").hide();
//     } else {
//         $("#cmp_img").hide();
//     }
// });

// // const county = ['--縣市--', '台北市', '新北市', '台中市', '台東縣', '台南市', '宜蘭縣', '花蓮縣', '金門縣', '南投縣', '屏東縣', '苗栗縣',
// //             '桃園市', '高雄市', '基隆市', '連江縣', '雲林縣', '新竹市', '新竹縣', '嘉義市', '嘉義縣', '彰化縣', '澎湖縣']
// // const town =
// // [
// //     ['台北市','松山區','信義區','大安區','中山區','中正區','大同區','萬華區','文山區','南港區','內湖區','士林區','北投區'],
// //     ['新北市','板橋區','三重區','中和區','永和區','新莊區','新店區','樹林區','鶯歌區','三峽區','淡水區','汐止區',
// //         '瑞芳區','土城區','蘆洲區','五股區','泰山區','林口區','深坑區','石碇區','坪林區',
// //         '三芝區','石門區','八里區','平溪區','雙溪區','貢寮區','金山區','萬里區','烏來區'],
// //     ['台中市','中區','東區','南區','西區','北區','西屯區','南屯區','北屯區','豐原區','東勢區',
// //         '大甲區','清水區','沙鹿區','梧棲區','后里區','神岡區','潭子區','大雅區','新社區','石岡區',
// //         '外埔區','大安區','烏日區','大肚區','龍井區','霧峰區','太平區','大里區','和平區'],
// //     ['台東縣','臺東市','成功鎮','關山鎮','卑南鄉','大武鄉','太麻里鄉','東河鄉','長濱鄉','鹿野鄉','池上鄉',
// //         '綠島鄉','延平鄉','海端鄉','達仁鄉','金峰鄉','蘭嶼鄉'],
// //     ['台南市','新營區','鹽水區','白河區','柳營區','後壁區','東山區','麻豆區','下營區','六甲區','官田區',
// //         '大內區','佳里區','學甲區','西港區','七股區','將軍區','北門區','新化區','善化區','新市區',
// //         '安定區','山上區','玉井區','楠西區','南化區','左鎮區','仁德區','歸仁區','關廟區','龍崎區',
// //         '永康區','東區','南區','北區','安南區','安平區','中西區'],
// //     ['宜蘭縣','宜蘭市','羅東鎮','蘇澳鎮','頭城鎮','礁溪鄉','壯圍鄉','員山鄉','冬山鄉','五結鄉','三星鄉',
// //         '大同鄉','南澳鄉'],
// //     ['花蓮縣','花蓮市','鳳林鎮','玉里鎮','新城鄉','吉安鄉','壽豐鄉','光復鄉','豐濱鄉','瑞穗鄉','富里鄉',
// //         '秀林鄉','萬榮鄉','卓溪鄉'],
// //     ['金門縣','金城鎮','金湖鎮','金沙鎮','金寧鄉','烈嶼鄉','烏坵鄉'],
// //     ['南投縣','南投市','埔里鎮','草屯鎮','竹山鎮','集集鎮','名間鄉','鹿谷鄉','中寮鄉','魚池鄉','國姓鄉',
// //         '水里鄉','信義鄉','仁愛鄉'],
// //     ['屏東縣','屏東市','潮州鎮','東港鎮','恆春鎮','萬丹鄉','長治鄉','麟洛鄉','九如鄉','里港鄉','鹽埔鄉',
// //         '高樹鄉','萬巒鄉','內埔鄉','竹田鄉','新埤鄉','枋寮鄉','新園鄉','崁頂鄉','林邊鄉','南州鄉',
// //         '佳冬鄉','琉球鄉','車城鄉','滿州鄉','枋山鄉','三地門鄉','霧臺鄉','瑪家鄉','泰武鄉','來義鄉',
// //         '春日鄉','獅子鄉','牡丹鄉'],
// //     ['苗栗縣','苗栗市','頭份市','苑裡鎮','通霄鎮','竹南鎮','後龍鎮','卓蘭鎮','大湖鄉','公館鄉','銅鑼鄉',
// //         '南庄鄉','頭屋鄉','三義鄉','西湖鄉','造橋鄉','三灣鄉','獅潭鄉','泰安鄉'],
// //     ['桃園市','桃園區','中壢區','大溪區','楊梅區','蘆竹區','大園區','龜山區','八德區','龍潭區','平鎮區',
// //         '新屋區','觀音區','復興區'],
// //     ['高雄市','鹽埕區','鼓山區','左營區','楠梓區','三民區','新興區','前金區','苓雅區','前鎮區','旗津區',
// //         '小港區','鳳山區','林園區','大寮區','大樹區','大社區','仁武區','鳥松區','岡山區','橋頭區',
// //         '燕巢區','田寮區','阿蓮區','路竹區','湖內區','茄萣區','永安區','彌陀區','梓官區','旗山區',
// //         '美濃區','六龜區','甲仙區','杉林區','內門區','茂林區','桃源區','那瑪夏區'],
// //     ['基隆市','中正區','七堵區','暖暖區','仁愛區','中山區','安樂區','信義區'],
// //     ['連江縣','南竿鄉','北竿鄉','莒光鄉','東引鄉'],
// //     ['雲林縣','斗六市','斗南鎮','虎尾鎮','西螺鎮','土庫鎮','北港鎮','古坑鄉','大埤鄉','莿桐鄉','林內鄉',
// //         '二崙鄉','崙背鄉','麥寮鄉','東勢鄉','褒忠鄉','臺西鄉','元長鄉','四湖鄉','口湖鄉','水林鄉'],
// //     ['新竹市','東區','北區','香山區'],
// //     ['新竹縣','竹北市','關西鎮','新埔鎮','竹東鎮','湖口鄉','橫山鄉','新豐鄉','芎林鄉','寶山鄉','北埔鄉',
// //         '峨眉鄉','尖石鄉','五峰鄉'],
// //     ['嘉義市','東區','西區'],
// //     ['嘉義縣','太保市','朴子市','布袋鎮','大林鎮','民雄鄉','溪口鄉','新港鄉','六腳鄉','東石鄉','義竹鄉',
// //         '鹿草鄉','水上鄉','中埔鄉','竹崎鄉','梅山鄉','番路鄉','大埔鄉','阿里山鄉'],
// //     ['彰化縣','彰化市','員林市','鹿港鎮','和美鎮','北斗鎮','溪湖鎮','田中鎮','二林鎮','線西鄉','伸港鄉',
// //         '福興鄉','秀水鄉','花壇鄉','芬園鄉','大村鄉','埔鹽鄉','埔心鄉','永靖鄉','社頭鄉','二水鄉',
// //         '田尾鄉','埤頭鄉','芳苑鄉','大城鄉','竹塘鄉','溪州鄉'],
// //     ['澎湖縣','馬公市','湖西鄉','白沙鄉','西嶼鄉','望安鄉','七美鄉']
// // ]

// // 目前改文字填入，先用不到
// // function selectcounty() {
// //     const select = document.getElementById("dropdown_county").value
// //     const element = document.getElementById("dropdown_town")
// //     let townhtml = ''
// //     town.forEach(t => {
// //         if (t[0] === select) {
// //             for(let i = 1; i < t.length; i++) {
// //                 townhtml += `<option>${t[i]}</option>`
// //             }
// //         }
// //     })
// //     element.innerHTML = townhtml
// // }

// function changestype() {
//     let checked = $("[name=stype]:checked");

//     if (checked.val() == 2) {
//         $("#cmp_img").show();
//         if (!!$("#cmp_img > img")[0].currentSrc) {
//             $("#cmp_img input").hide();
//         } else {
//             $("#cmp_img input").show();
//         }
//     } else {
//         $("#cmp_img").hide();
//     }

//     if (checked.val() == 3) {
//         $("#custom_name").show();
//     } else {
//         $("#custom_name").hide();
//     }
// }

// function setaddr() {
//     let ischecked = $("#setaddress").is(":checked");
//     if (ischecked) {
//         $("#connection_postal").attr("disabled", true);
//         $("#connection_address").attr("disabled", true);
//     } else {
//         $("#connection_postal").attr("disabled", false);
//         $("#connection_address").attr("disabled", false);
//     }
// }

// function changimg() {
//     $("#cmp_img input").show();
// }

// async function readAsDataURL() {
//     //判斷瀏覽器支援 filereader，IE 好像就不能...
//     if (typeof FileReader == "undifined") {
//         alert("瀏覽器不支援");
//         return;
//     }
//     let invoicetitleimage = $("#cmp_img > input")[0].files[0];
//     //判斷是否為圖片檔
//     if (!/image\/\w+/.test(invoicetitleimage.type)) {
//         alert("文件不是圖片");
//         return;
//     }

//     let reader = new FileReader();
//     reader.readAsDataURL(invoicetitleimage);
//     reader.onload = function (e) {
//         let img = new Image();
//         img.src = this.result;
//         img.onload = () => {
//             let canvas = document.createElement("canvas");
//             // 畫布高度比例調整到50以下
//             let range = 100;
//             while ((range / 100) * img.height > 50) {
//                 range--;
//             }
//             canvas.width = (img.width * range) / 100;
//             canvas.height = (img.height * range) / 100;
//             let ctx = canvas.getContext("2d");
//             ctx.drawImage(img, 0, 0, canvas.width, canvas.height); // 把圖片畫在畫布上(0,0)作標到(canvas.width,canvas.height)
//             let newImg = canvas.toDataURL(img, 0.8); // 0.8是圖片壓縮比

//             $("#cmp_img img")[0].src = newImg;
//         };
//         $("#cmp_img input").hide();
//     };
// }

// async function submitcompanyinfo() {
//     const name = $("#name").val().trim() || null,
//         personincharge = $("#personincharge").val().trim() || null,
//         taxid = $("#taxid").val().trim() || null,
//         cmp_postal = $("#cmp_postal").val().trim() || null,
//         cmp_address = $("#cmp_address").val().trim() || null,
//         connection_postal = $("#connection_postal").val().trim() || null,
//         address_checked = $("#setaddress").is(":checked") || null,
//         connection_address = $("#connection_address").val().trim() || null,
//         tel = $("#tel").val().trim() || null,
//         facsimilenumber = $("#facsimilenumber").val().trim() || null,
//         email = $("#email").val().trim() || null,
//         roleremark = $("#roleremark").val().trim() || null,
//         printtype = $("[name=stype]:checked").val() || null,
//         customname = $("#custom_name").val().trim() || null,
//         invoicetitleimage = $("#cmp_img > img")[0].currentSrc || null;

//     if (!name) {
//         alert("公司名稱不可空白");
//         return;
//     }

//     if (taxid.length != 9) {
//         alert("稅籍編號只能9碼");
//         return;
//     }

//     const frominfo = {};
//     frominfo["name"] = name;
//     frominfo["personincharge"] = personincharge;
//     // frominfo['id'] = id
//     frominfo["taxid"] = taxid;
//     frominfo["companyaddress"] = `${cmp_postal}/${cmp_address}`;
//     if (address_checked) {
//         frominfo["connectionaddress"] = `${cmp_postal}/${cmp_address}`;
//     } else {
//         frominfo[
//             "connectionaddress"
//         ] = `${connection_postal}/${connection_address}`;
//     }
//     frominfo["tel"] = tel;
//     frominfo["facsimilenumber"] = facsimilenumber;
//     frominfo["email"] = email;
//     frominfo["roleremark"] = roleremark;
//     frominfo["printtype"] = printtype;
//     frominfo["invoicetitleimage"] = invoicetitleimage;
//     frominfo["customname"] = customname;

//     submit(frominfo, `/put/companyinfo`, `/companyinfo`);
// }
