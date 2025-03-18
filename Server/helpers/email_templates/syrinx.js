exports.syrinx=(user,pass)=>
{
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" xmlns:o="urn:schemas-microsoft-com:office:office" xmlns="http://www.w3.org/1999/xhtml">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="x-apple-disable-message-reformatting">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="format-detection" content="telephone=no">
    <title></title>
   <style>
    /* CONFIG STYLES Please do not delete and edit CSS styles below */
/* IMPORTANT THIS STYLES MUST BE ON FINAL EMAIL */
.rollover:hover .rollover-first {
    max-height: 0px !important;
    display: none !important;
}

.rollover:hover .rollover-second {
    max-height: none !important;
    display: block !important;
}

.rollover span {
    font-size: 0px;
}

u+.body img~div div {
    display: none;
}

#outlook a {
    padding: 0;
}

span.MsoHyperlink,
span.MsoHyperlinkFollowed {
    color: inherit;
    mso-style-priority: 99;
}

a.es-button {
    mso-style-priority: 100 !important;
    text-decoration: none !important;
}

a[x-apple-data-detectors],
#MessageViewBody a {
    color: inherit !important;
    text-decoration: none !important;
    font-size: inherit !important;
    font-family: inherit !important;
    font-weight: inherit !important;
    line-height: inherit !important;
}

.es-desk-hidden {
    display: none;
    float: left;
    overflow: hidden;
    width: 0;
    max-height: 0;
    line-height: 0;
    mso-hide: all;
}

td .es-button-border:hover a.es-button-1618490135548 {
    background: #adadad !important;
    border-color: #adadad !important;
}

td .es-button-border-1618490135548:hover {
    border-style: solid solid solid solid !important;
    background: #adadad !important;
    border-color: #42d159 #42d159 #42d159 #42d159 !important;
}

td .es-button-border:hover a.es-button-2785 {
    color: #FFD700 !important;
}

/*
  END OF IMPORTANT
*/
body {
    width: 100%;
    height: 100%;
}

table {
    mso-table-lspace: 0pt;
    mso-table-rspace: 0pt;
    border-collapse: collapse;
    border-spacing: 0px;
}

table td,
body,
.es-wrapper {
    padding: 0;
    Margin: 0;
}

.es-content,
.es-header,
.es-footer {
    width: 100%;
    table-layout: fixed !important;
}

img {
    display: block;
    font-size: 14px;
    border: 0;
    outline: none;
    text-decoration: none;
}

p,
hr {
    Margin: 0;
}

h1,
h2,
h3,
h4,
h5,
h6 {
    Margin: 0;
    font-family: georgia, times, 'times new roman', serif;
    mso-line-height-rule: exactly;
    letter-spacing: 0;
}

p,
a {
    mso-line-height-rule: exactly;
}

.es-left {
    float: left;
}

.es-right {
    float: right;
}

.es-p5t {
    padding-top: 5px;
}

.es-p5l {
    padding-left: 5px;
}

.es-p5r {
    padding-right: 5px;
}

.es-p15 {
    padding: 15px;
}

.es-p15b {
    padding-bottom: 15px;
}

.es-p15l {
    padding-left: 15px;
}

.es-p15r {
    padding-right: 15px;
}

.es-p20 {
    padding: 20px;
}

.es-p25 {
    padding: 25px;
}

.es-p25l {
    padding-left: 25px;
}

.es-p25r {
    padding-right: 25px;
}

.es-p30 {
    padding: 30px;
}

.es-p30t {
    padding-top: 30px;
}

.es-p30b {
    padding-bottom: 30px;
}

.es-p30l {
    padding-left: 30px;
}

.es-p30r {
    padding-right: 30px;
}

.es-p35 {
    padding: 35px;
}

.es-p35t {
    padding-top: 35px;
}

.es-p35b {
    padding-bottom: 35px;
}

.es-p35l {
    padding-left: 35px;
}

.es-p35r {
    padding-right: 35px;
}

.es-p40 {
    padding: 40px;
}

.es-p40t {
    padding-top: 40px;
}

.es-menu td {
    border: 0;
}

.es-menu td a img {
    display: inline !important;
    vertical-align: middle;
}

/*
  END CONFIG STYLES
  */
s {
    text-decoration: line-through;
}

ul,
ol {
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
    padding: 0px 0px 0px 40px;
    margin: 15px 0px;
}

ul li {
    color: #666666;
}

ol li {
    color: #666666;
}

li {
    margin: 0px 0px 15px;
    font-size: 14px;
}

a {
    text-decoration: underline;
}

.es-menu td a {
    font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace;
    text-decoration: none;
    display: block;
}

.es-wrapper {
    width: 100%;
    height: 100%;
    background-repeat: repeat;
    background-position: center top;
}

.es-wrapper-color,
.es-wrapper {
    background-color: #f7f7f7;
}

.es-content-body p,
.es-footer-body p,
.es-header-body p,
.es-infoblock p {
    font-family: 'courier new', courier, 'lucida sans typewriter', 'lucida typewriter', monospace;
    line-height: 150%;
    letter-spacing: 0;
}

.es-header {
    background-color: transparent;
    background-repeat: repeat;
    background-position: center top;
}

.es-header-body {
    background-color: #ffffff;
}

.es-header-body p {
    color: #666666;
    font-size: 14px;
}

.es-header-body a {
    color: #3d7781;
    font-size: 14px;
}

.es-content-body {
    background-color: #ffffff;
}

.es-content-body a {
    color: #3d7781;
    font-size: 14px;
}

.es-footer {
    background-color: transparent;
    background-repeat: repeat;
    background-position: center top;
}

.es-footer-body {
    background-color: #023047;
}

.es-footer-body p {
    color: #ffffff;
    font-size: 14px;
}

.es-footer-body a {
    color: #cccccc;
    font-size: 14px;
}

.es-content-body p {
    color: #666666;
    font-size: 14px;
}

.es-infoblock p {
    font-size: 12px;
    color: #cccccc;
}

.es-infoblock a {
    font-size: 12px;
    color: #cccccc;
}

h1 {
    font-size: 30px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #023047;
}

h2 {
    font-size: 24px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #023047;
}

h3 {
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #023047;
}

.es-header-body h1 a,
.es-content-body h1 a,
.es-footer-body h1 a {
    font-size: 30px;
}

.es-header-body h2 a,
.es-content-body h2 a,
.es-footer-body h2 a {
    font-size: 24px;
}

.es-header-body h3 a,
.es-content-body h3 a,
.es-footer-body h3 a {
    font-size: 20px;
}

h4 {
    font-size: 24px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #333333;
}

h5 {
    font-size: 20px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #333333;
}

h6 {
    font-size: 16px;
    font-style: normal;
    font-weight: normal;
    line-height: 120%;
    color: #333333;
}

.es-header-body h4 a,
.es-content-body h4 a,
.es-footer-body h4 a {
    font-size: 24px;
}

.es-header-body h5 a,
.es-content-body h5 a,
.es-footer-body h5 a {
    font-size: 20px;
}

.es-header-body h6 a,
.es-content-body h6 a,
.es-footer-body h6 a {
    font-size: 16px;
}

a.es-button,
button.es-button {
    padding: 15px 30px 15px 30px;
    display: inline-block;
    background: #fb8500;
    border-radius: 30px 30px 30px 30px;
    font-size: 18px;
    font-family: arial, 'helvetica neue', helvetica, sans-serif;
    font-weight: normal;
    font-style: normal;
    line-height: 120%;
    color: #ffffff;
    text-decoration: none !important;
    width: auto;
    text-align: center;
    letter-spacing: 0;
    mso-padding-alt: 0;
    mso-border-alt: 10px solid #fb8500;
}

.es-button-border {
    border-style: solid;
    border-color: #2cb543 #2cb543 #2cb543 #2cb543;
    background: #fb8500;
    border-width: 0px 0px 0px 0px;
    display: inline-block;
    border-radius: 30px 30px 30px 30px;
    width: auto;
}

.es-button img {
    display: inline-block;
    vertical-align: middle;
}

.es-fw,
.es-fw .es-button {
    display: block;
}

.es-il,
.es-il .es-button {
    display: inline-block;
}

.es-text-rtl h1,
.es-text-rtl h2,
.es-text-rtl h3,
.es-text-rtl h4,
.es-text-rtl h5,
.es-text-rtl h6,
.es-text-rtl input,
.es-text-rtl label,
.es-text-rtl textarea,
.es-text-rtl p,
.es-text-rtl ol,
.es-text-rtl ul,
.es-text-rtl .es-menu a,
.es-text-rtl .es-table {
    direction: rtl;
}

.es-text-ltr h1,
.es-text-ltr h2,
.es-text-ltr h3,
.es-text-ltr h4,
.es-text-ltr h5,
.es-text-ltr h6,
.es-text-ltr input,
.es-text-ltr label,
.es-text-ltr textarea,
.es-text-ltr p,
.es-text-ltr ol,
.es-text-ltr ul,
.es-text-ltr .es-menu a,
.es-text-ltr .es-table {
    direction: ltr;
}

.es-text-rtl ol,
.es-text-rtl ul {
    padding: 0px 40px 0px 0px;
}

.es-text-ltr ul,
.es-text-ltr ol {
    padding: 0px 0px 0px 40px;
}

/*
  RESPONSIVE STYLES
  Please do not delete and edit CSS styles below.

  If you don't need responsive layout, please delete this section.
  */
.es-p10t {
    padding-top: 10px;
}

.es-p15t {
    padding-top: 15px;
}

.es-p20r {
    padding-right: 20px;
}

.es-p20l {
    padding-left: 20px;
}

.es-p20t {
    padding-top: 20px;
}

.es-p20b {
    padding-bottom: 20px;
}

.es-p10b {
    padding-bottom: 10px;
}

.es-p5 {
    padding: 5px;
}

.es-p10r {
    padding-right: 10px;
}

.es-p10l {
    padding-left: 10px;
}

.es-p5b {
    padding-bottom: 5px;
}

.es-p10 {
    padding: 10px;
}

.es-p40r {
    padding-right: 40px;
}

.es-p40b {
    padding-bottom: 40px;
}

.es-p40l {
    padding-left: 40px;
}

.es-p25t {
    padding-top: 25px;
}

.es-p25b {
    padding-bottom: 25px;
}

.es-p-default {
    padding-top: 20px;
    padding-right: 20px;
    padding-left: 20px;
}

@media only screen and (max-width: 600px) {
    h1 {
        font-size: 13px !important;
        text-align: center;
    }

    h2 {
        font-size: 12px !important;
        text-align: center;
    }

    h3 {
        font-size: 8px !important;
        text-align: center;
    }

    .es-m-p0r {
        padding-right: 0px !important;
    }

    .es-p-default {}

    *[class="gmail-fix"] {
        display: none !important;
    }

    p,
    a {
        line-height: 150% !important;
    }

    h1,
    h1 a {
        line-height: 120% !important;
    }

    h2,
    h2 a {
        line-height: 120% !important;
    }

    h3,
    h3 a {
        line-height: 120% !important;
    }

    h4,
    h4 a {
        line-height: 120% !important;
    }

    h5,
    h5 a {
        line-height: 120% !important;
    }

    h6,
    h6 a {
        line-height: 120% !important;
    }

    .es-header-body p {}

    .es-content-body p {}

    .es-footer-body p {}

    .es-infoblock p {}

    h4 {
        font-size: 24px !important;
        text-align: left;
    }

    h5 {
        font-size: 20px !important;
        text-align: left;
    }

    h6 {
        font-size: 16px !important;
        text-align: left;
    }

    .es-header-body h1 a,
    .es-content-body h1 a,
    .es-footer-body h1 a {
        font-size: 13px !important;
    }

    .es-header-body h2 a,
    .es-content-body h2 a,
    .es-footer-body h2 a {
        font-size: 12px !important;
    }

    .es-header-body h3 a,
    .es-content-body h3 a,
    .es-footer-body h3 a {
        font-size: 8px !important;
    }

    .es-header-body h4 a,
    .es-content-body h4 a,
    .es-footer-body h4 a {
        font-size: 24px !important;
    }

    .es-header-body h5 a,
    .es-content-body h5 a,
    .es-footer-body h5 a {
        font-size: 20px !important;
    }

    .es-header-body h6 a,
    .es-content-body h6 a,
    .es-footer-body h6 a {
        font-size: 16px !important;
    }

    .es-menu td a {
        font-size: 16px !important;
    }

    .es-header-body p,
    .es-header-body a {
        font-size: 10px !important;
    }

    .es-content-body p,
    .es-content-body a {
        font-size: 11px !important;
    }

    .es-footer-body p,
    .es-footer-body a {
        font-size: 12px !important;
    }

    .es-infoblock p,
    .es-infoblock a {
        font-size: 12px !important;
    }

    .es-m-txt-c,
    .es-m-txt-c h1,
    .es-m-txt-c h2,
    .es-m-txt-c h3,
    .es-m-txt-c h4,
    .es-m-txt-c h5,
    .es-m-txt-c h6 {
        text-align: center !important;
    }

    .es-m-txt-r,
    .es-m-txt-r h1,
    .es-m-txt-r h2,
    .es-m-txt-r h3,
    .es-m-txt-r h4,
    .es-m-txt-r h5,
    .es-m-txt-r h6 {
        text-align: right !important;
    }

    .es-m-txt-j,
    .es-m-txt-j h1,
    .es-m-txt-j h2,
    .es-m-txt-j h3,
    .es-m-txt-j h4,
    .es-m-txt-j h5,
    .es-m-txt-j h6 {
        text-align: justify !important;
    }

    .es-m-txt-l,
    .es-m-txt-l h1,
    .es-m-txt-l h2,
    .es-m-txt-l h3,
    .es-m-txt-l h4,
    .es-m-txt-l h5,
    .es-m-txt-l h6 {
        text-align: left !important;
    }

    .es-m-txt-r img,
    .es-m-txt-c img,
    .es-m-txt-l img {
        display: inline !important;
    }

    .es-m-txt-r .rollover:hover .rollover-second,
    .es-m-txt-c .rollover:hover .rollover-second,
    .es-m-txt-l .rollover:hover .rollover-second {
        display: inline !important;
    }

    .es-m-txt-r .rollover span,
    .es-m-txt-c .rollover span,
    .es-m-txt-l .rollover span {
        line-height: 0 !important;
        font-size: 0 !important;
    }

    .es-spacer {
        display: inline-table;
    }

    a.es-button,
    button.es-button {
        font-size: 12px !important;
        padding: 10px 20px 10px 20px !important;
        line-height: 120% !important;
    }

    a.es-button,
    button.es-button,
    .es-button-border {
        display: inline-block !important;
    }

    .es-m-fw,
    .es-m-fw.es-fw,
    .es-m-fw .es-button {
        display: block !important;
    }

    .es-m-il,
    .es-m-il .es-button,
    .es-social,
    .es-social td,
    .es-menu {
        display: inline-block !important;
    }

    .es-adaptive table,
    .es-left,
    .es-right {
        width: 100% !important;
    }

    .es-content table,
    .es-header table,
    .es-footer table,
    .es-content,
    .es-footer,
    .es-header {
        width: 100% !important;
        max-width: 600px !important;
    }

    .adapt-img {
        width: 100% !important;
        height: auto !important;
    }

    .es-mobile-hidden,
    .es-hidden {
        display: none !important;
    }

    .es-desk-hidden {
        width: auto !important;
        overflow: visible !important;
        float: none !important;
        max-height: inherit !important;
        line-height: inherit !important;
        display: table-row !important;
    }

    tr.es-desk-hidden {
        display: table-row !important;
    }

    table.es-desk-hidden {
        display: table !important;
    }

    td.es-desk-menu-hidden {
        display: table-cell !important;
    }

    .es-menu td {
        width: 1% !important;
    }

    table.es-table-not-adapt,
    .esd-block-html table {
        width: auto !important;
    }

    .h-auto {
        height: auto !important;
    }

    .img-6861 {
        width: 70px !important;
    }

    .es-text-7963 .es-text-mobile-size-48.es-override-size,
    .es-text-7963 .es-text-mobile-size-48.es-override-size * {
        font-size: 48px !important;
        line-height: 150% !important;
    }
}

/*
  END RESPONSIVE STYLES
*/
ul li,
ol li {
    margin-left: 0;
}
   </style>
</head>

<body data-new-gr-c-s-loaded="14.1188.0" class="body">
    <div dir="ltr" class="es-wrapper-color">
        <!--[if gte mso 9]>
			<v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
				<v:fill type="tile" color="#f7f7f7"></v:fill>
			</v:background>
		<![endif]-->
        <table cellpadding="0" width="100%" cellspacing="0" class="es-wrapper">
            <tbody>
                <tr>
                    <td valign="top" class="esd-email-paddings">
                        <table cellpadding="0" cellspacing="0" align="center" class="esd-header-popover es-header">
                            <tbody>
                                <tr>
                                    <td align="center" class="esd-stripe">
                                        <table width="600" align="center" cellpadding="0" cellspacing="0" class="es-header-body" style="background-color:transparent">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#000000" align="left" class="esd-structure" style="background-color:#000000;border-radius:10px 10px 0px 0px">
                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="center" width="600" valign="top" class="es-m-p0r esd-container-frame">
                                                                        <table cellpadding="0" cellspacing="0" width="100%" style="border-radius: 15px; border-collapse: separate;">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5b" style="font-size:0">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom: 21px solid #073902; background: unset; height: 1px; width: 100%; margin: 0px;"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image" style="font-size:0"><a target="_blank"><img src="https://fnbwguk.stripocdn.email/content/guids/CABINET_ce7bd0fc763e7788ccf05b3eadfc13976fb118f446a0a909128090d11cd86859/images/ccs_S2Z.png" alt width="100" class="img-6861 adapt-img"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" align="center" cellspacing="0" class="es-content">
                            <tbody>
                                <tr>
                                    <td align="center" class="esd-stripe">
                                        <table cellspacing="0" cellpadding="0" bgcolor="#ffffff" align="center" width="600" class="es-content-body" style="background-color:#ffffff">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#000000" align="left" class="esd-structure es-p15t es-p20r es-p20l" style="background-color:#000000">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" width="560" class="esd-container-frame">
                                                                        <table cellspacing="0" width="100%" cellpadding="0">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-p20t es-p20b" style="font-size:0px"><a target="_blank"><img src="https://fnbwguk.stripocdn.email/content/guids/CABINET_ce7bd0fc763e7788ccf05b3eadfc13976fb118f446a0a909128090d11cd86859/images/vector_smart_object_copy_jIY.png" alt height="58" class="adapt-img" style="display:block"></a></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10b">
                                                                                        <p style="color: #d8d8d5; font-family: -apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'; font-size: 20px; line-height: 150% !important;">Hi  ${user} ,</p>
                                                                                        <p style="line-height:150% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px"><br>below are your details to login inside the game:<br>USERNAME: <span style="color:#FFD700;"> ${user}</span></p>
                                                                                        <p style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:150% !important;color:#d8d8d5">PASSWORD: <span style="color:#FFD700;">${pass}</span></p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5" style="font-size:0">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="border-bottom:2px dashed #c8c8c7;background:unset;height:1px;width:100%;margin:0px"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10b">
                                                                                        <p style="font-size:16px;line-height:150% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">We are delighted to present you <strong>Syrinx, the biggest</strong></p>
                                                                                        <p style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:150% !important;color:#d8d8d5"><strong>&nbsp;online CTF event</strong> <strong>of TIET</strong></p>
                                                                                        <p style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:150% !important;color:#d8d8d5"><br></p>
                                                                                        <p style="font-family: -apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'; font-size: 23px; color: #ffd700; line-height: 150% !important;"><strong>EVENT STARTS AT 11PM</strong></p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5t es-p10r es-p10l" style="font-size:0">
                                                                                        <table cellspacing="0" border="0" width="100%" height="100%" cellpadding="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="margin:0px;border-bottom:2px solid #ffd700;background:unset;height:1px;width:100%"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="left" class="esd-block-text es-p10t es-p5b">
                                                                                        <p style="color: #d8d8d5; font-family: arial, 'helvetica neue', helvetica, sans-serif; font-size: 20px; text-align: center; line-height: 130% !important;">INSTRUCTIONS:</p>
                                                                                        <ul>
                                                                                            <li style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">
                                                                                                <p style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important;color:#d8d8d5">Participants must join discord vc of the team for the entirety of the event to ensure moderation.(Atleast 3 members of the team should be present)</p>
                                                                                            </li>
                                                                                            <li style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">
                                                                                                <p style="font-size:16px;line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">The game consists of three levels.</p>
                                                                                            </li>
                                                                                            <li style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">
                                                                                                <p style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">In level 1, every correct answer makes the team earn +100 points, and usage of hint will result in loss of -30 points.</p>
                                                                                            </li>
                                                                                            <li style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">In level 2, every correct answer will earn the team +200 and usage of hint will cost them -60 points.</p>
                                                                                            </li>
                                                                                            <li style="font-size:16px;line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">
                                                                                                <p style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">In the last level,each correct answer will add 300 points to the team's score, while using a hint will deduct 90 points.</p>
                                                                                            </li>
                                                                                            <li style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">Each team can consist of 1-4 players.</p>
                                                                                            </li>
                                                                                            <li style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important;color:#d8d8d5">
                                                                                                <p style="font-size:16px;line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">All teams must join the official Discord server for Syrinx for all updates.</p>
                                                                                            </li>
                                                                                            <li style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important;color:#d8d8d5">
                                                                                                <p style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">Ensure that your Discord username matches the one filled in the registration form for identification purposes.</p>
                                                                                            </li>
                                                                                            <li style="font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important;color:#d8d8d5">
                                                                                                <p style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">Ensure to use only a Laptop/PC for the event.</p>
                                                                                            </li>
                                                                                            <li style="font-size:16px;line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">Participants must log in 10 minutes before the start of the game.</p>
                                                                                            </li>
                                                                                            <li style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">Note that the answer format is case-sensitive.</p>
                                                                                            </li>
                                                                                            <li style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">Hints will be provided to ease question difficulties.</p>
                                                                                            </li>
                                                                                            <li style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">
                                                                                                <p style="line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px">A leaderboard will display the progress of the teams for each level.</p>
                                                                                            </li>
                                                                                            <li style="font-size:16px;line-height:130% !important;color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'">
                                                                                                <p style="color:#d8d8d5;font-family:-apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol';font-size:16px;line-height:130% !important">In case of a tie between teams due to the same scores, the team that took less time to solve the questions will proceed.</p>
                                                                                            </li>
                                                                                        </ul>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-spacer es-p5" style="font-size:0px">
                                                                                        <table border="0" width="100%" height="100%" cellpadding="0" cellspacing="0">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td style="background:unset;height:1px;width:100%;margin:0px;border-bottom:2px solid #ffd700"></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10">
                                                                                        <p style="line-height: 150%; color: #d8d8d5; font-family: -apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'; font-size: 18px;">Kindly join for the discord stage at 10pm.</p>
                                                                                    </td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" valign="middle" class="esd-block-button h-auto" height="40"><span class="es-button-border" style="background:#073902;border-radius:13px"><a target="_blank" href="https://syrinx.ccstiet.com/" class="es-button es-button-2785" style="padding: 10px 20px; font-size: 14px; background: #073902; border-radius: 13px; color: #ffd700; mso-border-alt: 10px solid #073902">
                                                                                                <!--[if !mso]><!-- --><img align="absmiddle" src="https://fnbwguk.stripocdn.email/content/guids/CABINET_ce7bd0fc763e7788ccf05b3eadfc13976fb118f446a0a909128090d11cd86859/images/91_discord_logo_logos256.png" alt="icon" width="20" class="esd-icon-left" style="margin-right:11px">
                                                                                                <!--<![endif]-->Join Discord
                                                                                            </a></span></td>
                                                                                </tr>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-text es-p10">
                                                                                        <p style="line-height: 150%; color: #ffd700; font-family: -apple-system, blinkmacsystemfont, 'segoe ui', roboto, helvetica, arial, sans-serif, 'apple color emoji', 'segoe ui emoji', 'segoe ui symbol'; font-size: 18px;">Get ready for the mega event on 11pm.</p>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                                <tr>
                                                    <td align="left" bgcolor="#000000" class="esd-structure es-p10t es-p40b es-p40r es-p40l" style="background-color:#000000">
                                                        <table cellspacing="0" width="100%" cellpadding="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="center" valign="top" width="520" class="esd-container-frame">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-image es-p20t es-p10r es-p10l" style="font-size:0px"><a target="_blank"><img alt width="196" src="https://fnbwguk.stripocdn.email/content/guids/CABINET_ce7bd0fc763e7788ccf05b3eadfc13976fb118f446a0a909128090d11cd86859/images/logo_with_bg_VaG.png" class="adapt-img" style="display:block"></a></td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <table cellpadding="0" cellspacing="0" align="center" class="es-footer esd-footer-popover">
                            <tbody>
                                <tr>
                                    <td align="center" class="esd-stripe">
                                        <table cellpadding="0" cellspacing="0" width="600" align="center" class="es-footer-body" style="background-color:transparent">
                                            <tbody>
                                                <tr>
                                                    <td bgcolor="#073902" align="left" class="esd-structure es-p25t es-p25b es-p20r es-p20l" style="background-color:#073902;border-radius:0px 0px 10px 10px">
                                                        <table width="100%" cellpadding="0" cellspacing="0">
                                                            <tbody>
                                                                <tr>
                                                                    <td align="left" width="560" class="esd-container-frame">
                                                                        <table cellpadding="0" cellspacing="0" width="100%">
                                                                            <tbody>
                                                                                <tr>
                                                                                    <td align="center" class="esd-block-social" style="font-size:0">
                                                                                        <table cellspacing="0" cellpadding="0" class="es-table-not-adapt es-social">
                                                                                            <tbody>
                                                                                                <tr>
                                                                                                    <td align="center" valign="top" class="es-p10r" esd-tmp-icon-type="facebook"><a href="https://www.facebook.com/CCSTU" target="_blank"><img width="32" title="Facebook" src="https://fnbwguk.stripocdn.email/content/assets/img/social-icons/circle-white/facebook-circle-white.png" alt="Fb"></a></td>
                                                                                                    <td valign="top" align="center" class="es-p10r" esd-tmp-icon-type="xcom"><a target="_blank" href="https://x.com/ccstiet"><img width="32" title="X" src="https://fnbwguk.stripocdn.email/content/assets/img/social-icons/circle-white/x-circle-white.png" alt="X"></a></td>
                                                                                                    <td align="center" valign="top" class="es-p10r" esd-tmp-icon-type="instagram"><a target="_blank" href="https://www.instagram.com/ccs_tiet/"><img alt="Inst" width="32" title="Instagram" src="https://fnbwguk.stripocdn.email/content/assets/img/social-icons/circle-white/instagram-circle-white.png"></a></td>
                                                                                                    <td valign="top" align="center" class="es-p10r" esd-tmp-icon-type="youtube"><a target="_blank" href="https://www.youtube.com/@ccstiet5176"><img src="https://fnbwguk.stripocdn.email/content/assets/img/social-icons/circle-white/youtube-circle-white.png" alt="Yt" width="32" title="Youtube"></a></td>
                                                                                                    <td valign="top" align="center" class="es-p10r" esd-tmp-icon-type="linkedin"><a target="_blank" href="https://www.linkedin.com/company/ccs-tiet/mycompany/"><img width="32" title="LinkedIn" src="https://fnbwguk.stripocdn.email/content/assets/img/social-icons/circle-white/linkedin-circle-white.png" alt="In"></a></td>
                                                                                                    <td align="center" valign="top" esd-tmp-icon-type="discord"><a href="https://discord.com/invite/YCe6vc2AeE" target="_blank"><img title="Discord" src="https://fnbwguk.stripocdn.email/content/assets/img/messenger-icons/circle-white/discort-circle-white.png" alt="Discord" width="32"></a></td>
                                                                                                </tr>
                                                                                            </tbody>
                                                                                        </table>
                                                                                    </td>
                                                                                </tr>
                                                                            </tbody>
                                                                        </table>
                                                                    </td>
                                                                </tr>
                                                            </tbody>
                                                        </table>
                                                    </td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</body>

</html>`
}