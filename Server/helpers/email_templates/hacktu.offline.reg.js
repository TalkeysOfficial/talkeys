exports.hacktuTemplate=(name,team,leader)=>{
    return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      dir="ltr"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      lang="EN"
    >
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta charset="UTF-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>Last day to register</title>
        <link
          href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"
          rel="stylesheet"
        />
        <!--<![endif]-->
        <style type="text/css">
          .rollover:hover .rollover-first {
            max-height: 0px !important;
            display: none !important;
          }
          .rollover:hover .rollover-second {
            max-height: none !important;
            display: inline-block !important;
          }
          .rollover span {
            font-size: 0px;
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
          a[x-apple-data-detectors] {
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
          .es-header-body a:hover {
            color: #2cb543 !important;
          }
          .es-content-body a:hover {
            color: #2cb543 !important;
          }
          .es-footer-body a:hover {
            color: #ffffff !important;
          }
          .es-infoblock a:hover {
            color: #cccccc !important;
          }
          .es-button-border:hover {
            border-color: #42d159 #42d159 #42d159 #42d159 !important;
            background: #56d66b !important;
          }
          .es-button-border:hover a.es-button,
          .es-button-border:hover button.es-button {
            background: #56d66b !important;
          }
          td .es-button-border:hover a.es-button-1706460746188 {
            background: #4577aa !important;
          }
          td .es-button-border-1706460746205:hover {
            background: #4577aa !important;
            border-color: #6391bf #6391bf #6391bf #42d159 !important;
          }
          @media only screen and (max-width: 600px) {
            h1 {
              font-size: 30px !important;
              text-align: left;
            }
            h2 {
              font-size: 24px !important;
              text-align: left;
            }
            h3 {
              font-size: 20px !important;
              text-align: left;
            }
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
            .es-header-body p {
            }
            .es-content-body p {
            }
            .es-footer-body p {
            }
            .es-infoblock p {
            }
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
              font-size: 30px !important;
            }
            .es-header-body h2 a,
            .es-content-body h2 a,
            .es-footer-body h2 a {
              font-size: 24px !important;
            }
            .es-header-body h3 a,
            .es-content-body h3 a,
            .es-footer-body h3 a {
              font-size: 20px !important;
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
              font-size: 14px !important;
            }
            .es-header-body p,
            .es-header-body a {
              font-size: 14px !important;
            }
            .es-content-body p,
            .es-content-body a {
              font-size: 14px !important;
            }
            .es-footer-body p,
            .es-footer-body a {
              font-size: 14px !important;
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
            .es-m-txt-l img,
            .es-m-txt-r .rollover:hover .rollover-second,
            .es-m-txt-c .rollover:hover .rollover-second,
            .es-m-txt-l .rollover:hover .rollover-second {
              display: inline !important;
            }
            .es-m-txt-r .rollover div,
            .es-m-txt-c .rollover div,
            .es-m-txt-l .rollover div {
              line-height: 0 !important;
              font-size: 0 !important;
            }
            .es-spacer {
              display: inline-table;
            }
            a.es-button,
            button.es-button {
              font-size: 18px !important;
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
            .adapt-img:not([src*="default-img"]) {
              width: 100% !important;
              height: auto !important;
              max-width: 280px !important;
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
            .es-social td {
              padding-bottom: 10px;
            }
            a.es-button,
            button.es-button {
              display: inline-block !important;
            }
            .es-button-border {
              display: inline-block !important;
            }
            .h-auto {
              height: auto !important;
            }
          }
          @media screen and (max-width: 384px) {
            .mail-message-content {
              width: 414px !important;
            }
          }
        </style>
      </head>
      <body
        data-new-gr-c-s-loaded="14.1114.0"
        bis_status="ok"
        bis_frame_id="302"
        style="width: 100%; height: 100%; padding: 0; margin: 0"
      >
        <div
          dir="ltr"
          class="es-wrapper-color"
          lang="EN"
          style="background-color: #ffffff"
        >
          <!--[if gte mso 9]>
            <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
              <v:fill type="tile" color="#ffffff"></v:fill>
            </v:background>
          <![endif]-->
          <table
            class="es-wrapper"
            width="100%"
            cellspacing="0"
            cellpadding="0"
            style="
              mso-table-lspace: 0pt;
              mso-table-rspace: 0pt;
              border-collapse: collapse;
              border-spacing: 0px;
              padding: 0;
              margin: 0;
              width: 100%;
              height: 100%;
              background-repeat: repeat;
              background-position: center top;
              background-color: #ffffff;
            "
          >
            <tr>
              <td valign="top" style="padding: 0; margin: 0">
                <table
                  class="es-header"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    width: 100%;
                    table-layout: fixed !important;
                    background-color: transparent;
                    background-repeat: repeat;
                    background-position: center top;
                  "
                >
                  <tr>
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-header-body"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#ffffff"
                        align="center"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #ffffff;
                          width: 600px;
                        "
                      >
                        <tr>
                          <td align="left" style="padding: 0; margin: 0">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 600px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    background="https://xizznc.stripocdn.email/content/guids/CABINET_ae3ff78e1e5306103bcb80b6ef93cce66f875458769366859b3bf78a2335e0d6/images/ight_blue_1.png"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                      background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_ae3ff78e1e5306103bcb80b6ef93cce66f875458769366859b3bf78a2335e0d6/images/ight_blue_1.png);
                                      background-repeat: no-repeat;
                                      background-position: left top;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 20px;
                                          margin: 0;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://www.saturnalia.in/assets/SAT_logo_nav-DJyL58YY.webp"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          height="198"
                                        />
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
                <table
                  class="es-footer"
                  cellspacing="0"
                  cellpadding="0"
                  align="center"
                  style="
                    mso-table-lspace: 0pt;
                    mso-table-rspace: 0pt;
                    border-collapse: collapse;
                    border-spacing: 0px;
                    width: 100%;
                    table-layout: fixed !important;
                    background-color: transparent;
                    background-repeat: repeat;
                    background-position: center top;
                  "
                >
                  <tr>
                    <td align="center" style="padding: 0; margin: 0">
                      <table
                        class="es-footer-body"
                        cellspacing="0"
                        cellpadding="0"
                        bgcolor="#F8F4EC"
                        align="center"
                        style="
                          mso-table-lspace: 0pt;
                          mso-table-rspace: 0pt;
                          border-collapse: collapse;
                          border-spacing: 0px;
                          background-color: #f8f4ec;
                          width: 600px;
                        "
                      >
                        <tr>
                          <td
                            align="left"
                            bgcolor="#F8F4EC"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-right: 20px;
                              padding-left: 20px;
                              background-color: #f8f4ec;
                            "
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          margin: 0;
                                          padding-top: 10px;
                                          padding-bottom: 20px;
                                          padding-right: 20px;
                                          padding-left: 20px;
                                          font-size: 0;
                                        "
                                        bgcolor="#F8F4EC"
                                      >
                                        <table
                                          border="0"
                                          width="80%"
                                          height="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                          "
                                        >
                                          <tr>
                                            <td
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                border-bottom: 3px solid #375e86;
                                                background: unset;
                                                height: 1px;
                                                width: 100%;
                                                margin: 0px;
                                              "
                                            ></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 15px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 54px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 36px !important;
                                          "
                                        >
                                          <strong>Thank You for Registering</strong>
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >

                                          Hi ${name} , You Have been
                                          successfully registered to attend SatHack in person!&nbsp;<br />
                                        </p>
                                        <br><br>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 20px !important;
                                            font-weight: 450;
                                          "
                                        >

                                        Please note, this mail is only for offline check-in. It is <b>mandatory</b> to apply through HackQuest.
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                          <strong>Team Name:</strong> ${team}
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                          <strong>Team Leader:</strong> ${leader}
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                          <strong>Venue:</strong> LT - Ground Floor <br />
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                         
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            bgcolor="#F8F4EC"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-right: 20px;
                              padding-left: 20px;
                              background-color: #f8f4ec;
                            "
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 20px;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <!-- <img
                                          class="adapt-img"
                                          src="https://www.saturnalia.in/assets/SAT_logo_nav-DJyL58YY.webp"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="404"
                                        /> -->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding: 0; margin: 0">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 600px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                          SatHack will be conducted on 15th and
                                          16th November.
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: roboto, 'helvetica neue',
                                              helvetica, arial, sans-serif;
                                            line-height: 39px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 26px !important;
                                          "
                                        >
                                          <strong
                                            >Check out other events in
                                            Saturnalia!</strong
                                          >
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding: 0; margin: 0">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 600px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="padding: 10px; margin: 0"
                                      >
                                        <!--[if mso
                                          ]><a
                                            href="https://hack.saturnalia.in/"
                                            target="_blank"
                                            hidden
                                          >
                                            <v:roundrect
                                              xmlns:v="urn:schemas-microsoft-com:vml"
                                              xmlns:w="urn:schemas-microsoft-com:office:word"
                                              esdevVmlButton
                                              href="https://hack.saturnalia.in/"
                                              style="
                                                height: 55px;
                                                v-text-anchor: middle;
                                                width: 202px;
                                              "
                                              arcsize="50%"
                                              strokecolor="#4577aa"
                                              strokeweight="1px"
                                              fillcolor="#375e86"
                                            >
                                              <w:anchorlock></w:anchorlock>
                                              <center
                                                style="
                                                  color: #ffffff;
                                                  font-family: arial,
                                                    'helvetica neue', helvetica,
                                                    sans-serif;
                                                  font-size: 22px !important;
                                                  font-weight: 400;
                                                  line-height: 22px;
                                                  mso-text-raise: 1px;
                                                "
                                              >
                                                Website Link
                                              </center>
                                            </v:roundrect></a
                                          > <!
                                        [endif]--><!--[if !mso]><!-- --><span
                                          class="msohide es-button-border-1706460746205 es-button-border"
                                          style="
                                            border-style: solid;
                                            border-color: #2cb543;
                                            background: #375e86;
                                            border-width: 0px 0px 2px 0px;
                                            display: inline-block;
                                            border-radius: 30px;
                                            width: auto;
                                            mso-hide: all;
                                            border-bottom-color: #4577aa;
                                            border-bottom-width: 2px;
                                            border-right-width: 2px;
                                            border-top-color: #4577aa;
                                            border-right-color: #4577aa;
                                          "
                                          ><a
                                            href="https://chat.whatsapp.com/FZ9PYe89RICDWnEIMoZ3DU"
                                            class="es-button es-button-1706460746188 msohide"
                                            target="_blank"
                                            style="
                                              mso-style-priority: 100 !important;
                                              text-decoration: none !important;
                                              mso-line-height-rule: exactly;
                                              color: #ffffff;
                                              font-size: 22px !important;
                                              padding: 15px 25px;
                                              display: inline-block;
                                              background: #375e86;
                                              border-radius: 30px;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-weight: normal;
                                              font-style: normal;
                                              line-height: 26px;
                                              width: auto;
                                              text-align: center;
                                              letter-spacing: 0;
                                              mso-padding-alt: 0;
                                              mso-border-alt: 10px solid #375e86;
                                              mso-hide: all;
                                            "
                                            >Whatsapp Link</a
                                          ></span
                                        ><!--<![endif]-->
                                      </td>
                                      <td
                                        align="center"
                                        style="padding: 10px; margin: 0"
                                      >
                                        <!--[if mso
                                          ]><a
                                            href="https://hack.saturnalia.in/"
                                            target="_blank"
                                            hidden
                                          >
                                            <v:roundrect
                                              xmlns:v="urn:schemas-microsoft-com:vml"
                                              xmlns:w="urn:schemas-microsoft-com:office:word"
                                              esdevVmlButton
                                              href="https://hack.saturnalia.in/"
                                              style="
                                                height: 55px;
                                                v-text-anchor: middle;
                                                width: 202px;
                                              "
                                              arcsize="50%"
                                              strokecolor="#4577aa"
                                              strokeweight="1px"
                                              fillcolor="#375e86"
                                            >
                                              <w:anchorlock></w:anchorlock>
                                              <center
                                                style="
                                                  color: #ffffff;
                                                  font-family: arial,
                                                    'helvetica neue', helvetica,
                                                    sans-serif;
                                                  font-size: 22px !important;
                                                  font-weight: 400;
                                                  line-height: 22px;
                                                  mso-text-raise: 1px;
                                                "
                                              >
                                                Website Link
                                              </center>
                                            </v:roundrect></a
                                          > <!
                                        [endif]--><!--[if !mso]><!-- --><span
                                          class="msohide es-button-border-1706460746205 es-button-border"
                                          style="
                                            border-style: solid;
                                            border-color: #2cb543;
                                            background: #375e86;
                                            border-width: 0px 0px 2px 0px;
                                            display: inline-block;
                                            border-radius: 30px;
                                            width: auto;
                                            mso-hide: all;
                                            border-bottom-color: #4577aa;
                                            border-bottom-width: 2px;
                                            border-right-width: 2px;
                                            border-top-color: #4577aa;
                                            border-right-color: #4577aa;
                                          "
                                          ><a
                                            href="https://discord.gg/HYuUveEs"
                                            class="es-button es-button-1706460746188 msohide"
                                            target="_blank"
                                            style="
                                              mso-style-priority: 100 !important;
                                              text-decoration: none !important;
                                              mso-line-height-rule: exactly;
                                              color: #ffffff;
                                              font-size: 22px !important;
                                              padding: 15px 25px;
                                              display: inline-block;
                                              background: #375e86;
                                              border-radius: 30px;
                                              font-family: arial, 'helvetica neue',
                                                helvetica, sans-serif;
                                              font-weight: normal;
                                              font-style: normal;
                                              line-height: 26px;
                                              width: auto;
                                              text-align: center;
                                              letter-spacing: 0;
                                              mso-padding-alt: 0;
                                              mso-border-alt: 10px solid #375e86;
                                              mso-hide: all;
                                            "
                                            >Discord Link</a
                                          ></span
                                        ><!--<![endif]-->
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding: 0; margin: 0">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 600px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        bgcolor="#F8F4EC"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: helvetica, 'helvetica neue',
                                              arial, verdana, sans-serif;
                                            line-height: 42px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 28px !important;
                                          "
                                        >
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td align="left" style="padding: 0; margin: 0">
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 600px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    bgcolor="#F8F4EC"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                      background-color: #f8f4ec;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 20px;
                                          padding-top: 20px;
                                        "
                                      >
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            bgcolor="#F8F4EC"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-left: 40px;
                              padding-right: 40px;
                              background-color: #f8f4ec;
                            "
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="center"
                                  valign="top"
                                  style="padding: 0; margin: 0; width: 520px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 20px;
                                          margin: 0;
                                          font-size: 0 !important;
                                        "
                                        bgcolor="#F8F4EC"
                                      >
                                        <table
                                          border="0"
                                          width="80%"
                                          height="100%"
                                          cellpadding="0"
                                          cellspacing="0"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                          "
                                        >
                                          <tr>
                                            <td
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                border-bottom: 3px solid #375e86;
                                                background: unset;
                                                height: 1px;
                                                width: 100%;
                                                margin: 0px;
                                              "
                                            ></td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            bgcolor="#055698"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-right: 20px;
                              padding-left: 20px;
                              background-color: #055698;
                              background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_ae3ff78e1e5306103bcb80b6ef93cce66f875458769366859b3bf78a2335e0d6/images/ight_blue_1.png);
                              background-repeat: no-repeat;
                              background-position: left top;
                            "
                            background="https://xizznc.stripocdn.email/content/guids/CABINET_ae3ff78e1e5306103bcb80b6ef93cce66f875458769366859b3bf78a2335e0d6/images/ight_blue_1.png"
                          >
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              width="100%"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                              "
                            >
                              <tr>
                                <td
                                  align="left"
                                  style="padding: 0; margin: 0; width: 560px"
                                >
                                  <table
                                    width="100%"
                                    cellspacing="0"
                                    cellpadding="0"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-bottom: 10px;
                                          font-size: 0;
                                        "
                                      >
                                        <table
                                          cellpadding="0"
                                          cellspacing="0"
                                          class="es-table-not-adapt es-social"
                                          style="
                                            mso-table-lspace: 0pt;
                                            mso-table-rspace: 0pt;
                                            border-collapse: collapse;
                                            border-spacing: 0px;
                                          "
                                        >
                                          <tr>
                                            <td
                                              align="center"
                                              valign="top"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-right: 25px;
                                              "
                                            >
                                              <a
                                                target="_blank"
                                                href="https://www.instagram.com/ccs_tiet/"
                                                style="
                                                  mso-line-height-rule: exactly;
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                  font-size: 14px !important;
                                                "
                                                ><img
                                                  title="Instagram"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png"
                                                  alt="Ig"
                                                  width="32"
                                                  height="32"
                                                  style="
                                                    display: block;
                                                    font-size: 14px !important;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                  "
                                              /></a>
                                            </td>
                                            <td
                                              align="center"
                                              valign="top"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-right: 25px;
                                              "
                                            >
                                              <a
                                                target="_blank"
                                                href="https://www.youtube.com/@ccstiet5176"
                                                style="
                                                  mso-line-height-rule: exactly;
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                  font-size: 14px !important;
                                                "
                                                ><img
                                                  title="Youtube"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png"
                                                  alt="Yt"
                                                  width="32"
                                                  height="32"
                                                  style="
                                                    display: block;
                                                    font-size: 14px !important;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                  "
                                              /></a>
                                            </td>
                                            <td
                                              align="center"
                                              valign="top"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-right: 25px;
                                              "
                                            >
                                              <a
                                                target="_blank"
                                                href="https://www.linkedin.com/company/ccs-tiet/?originalSubdomain=in"
                                                style="
                                                  mso-line-height-rule: exactly;
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                  font-size: 14px !important;
                                                "
                                                ><img
                                                  title="Linkedin"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png"
                                                  alt="In"
                                                  width="32"
                                                  height="32"
                                                  style="
                                                    display: block;
                                                    font-size:  14px !important;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                  "
                                              /></a>
                                            </td>
                                            <td
                                              align="center"
                                              valign="top"
                                              style="
                                                padding: 0;
                                                margin: 0;
                                                padding-right: 25px;
                                              "
                                            >
                                              <a
                                                target="_blank"
                                                href="https://discord.gg/YCe6vc2AeE"
                                                style="
                                                  mso-line-height-rule: exactly;
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                  font-size: 14px !important;
                                                "
                                                ><img
                                                  title="Discord"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/messenger-icons/circle-colored/discort-circle-colored.png"
                                                  alt="Discord"
                                                  width="32"
                                                  height="32"
                                                  style="
                                                    display: block;
                                                    font-size: 14px !important;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                  "
                                              /></a>
                                            </td>
                                            <td
                                              align="center"
                                              valign="top"
                                              style="padding: 0; margin: 0"
                                            >
                                              <a
                                                target="_blank"
                                                href="https://www.twitter.com/ccstiet"
                                                style="
                                                  mso-line-height-rule: exactly;
                                                  text-decoration: underline;
                                                  color: #ffffff;
                                                  font-size: 14px !important;
                                                "
                                                ><img
                                                  title="X.com"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/social-icons/circle-colored/x-circle-colored.png"
                                                  alt="X"
                                                  width="32"
                                                  height="32"
                                                  style="
                                                    display: block;
                                                    font-size: 14px !important;
                                                    border: 0;
                                                    outline: none;
                                                    text-decoration: none;
                                                  "
                                              /></a>
                                            </td>
                                          </tr>
                                        </table>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>
          </table>
        </div>
      </body>
    </html>
    `
 }
exports.defaultTe = ()=>{
    return `
    <iframe src="https://hacktu.ccstiet.com/" style="width: 100%; height: 100%; border: none;"></iframe>
    `
}
