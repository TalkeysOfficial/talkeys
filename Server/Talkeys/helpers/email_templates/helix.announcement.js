exports.helixAnnouncementTemplate=()=>{
    return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html
      dir="ltr"
      xmlns="http://www.w3.org/1999/xhtml"
      xmlns:o="urn:schemas-microsoft-com:office:office"
      lang="en"
    >
      <head>
        <meta content="width=device-width, initial-scale=1" name="viewport" />
        <meta charset="UTF-8" />
        <meta name="x-apple-disable-message-reformatting" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta content="telephone=no" name="format-detection" />
        <title>HelixAnnouncement</title>
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
            font-size: 0px !important;
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
            background: #eadec7 !important;
            color: #0f1932 !important;
          }
          td .es-button-border-1706460746205:hover {
            background: #eadec7 !important;
            border-color: #6391bf #6391bf #2f6ca2 #42d159 !important;
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
              max-width: 250px !important;
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
        data-new-gr-c-s-loaded="9.71.0"
        bis_status="ok"
        bis_frame_id="1246"
        style="width: 100%; height: 100%; padding: 0; margin: 0"
      >
        <div
          dir="ltr"
          class="es-wrapper-color"
          lang="en"
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
                                    background="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                      background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png);
                                      background-repeat: no-repeat;
                                      background-position: center top;
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
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/tracedlogo_1.png"
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
                            bgcolor="#0f1932"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-right: 20px;
                              padding-left: 20px;
                              background-color: #0f1932;
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
                                          font-size: 0px !important; 
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/helixlogo.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="364"
                                        />
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
                            bgcolor="#0f1932"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-top: 20px;
                              padding-right: 20px;
                              padding-left: 20px;
                              background-color: #0f1932;
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
                                    <tbody class="ui-droppable-hover">
                                      <tr>
                                        <td
                                          align="center"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 20px;
                                            font-size: 0 !important;
                                          "
                                          bgcolor="#0f1932"
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
                                                  border-bottom-width: 3px;
                                                  border-bottom-style: solid;
                                                  border-bottom-color: #f8f4ec;
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
                                          bgcolor="#0f1932"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-top: 15px;
                                            padding-bottom: 10px;
                                          "
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              mso-line-height-rule: exactly;
                                              font-family: roboto, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              line-height: 32px;
                                              letter-spacing: 0;
                                              color: #f8f4ec;
                                              font-size: 21px !important;
                                            "
                                          >
                                            Embark on a week-long exploration of the
                                            diverse facets of the technical realm
                                            with Helix, a dynamic series of events
                                            designed to captivate your mind and
                                            offer invaluable insights into the
                                            ever-evolving world of technology.
                                          </p>
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          align="center"
                                          bgcolor="#0f1932"
                                          style="padding: 15px; margin: 0"
                                        >
                                          <!--[if mso
                                            ]><a
                                              href="https://helix.ccstiet.com/"
                                              target="_blank"
                                              hidden
                                            >
                                              <v:roundrect
                                                xmlns:v="urn:schemas-microsoft-com:vml"
                                                xmlns:w="urn:schemas-microsoft-com:office:word"
                                                esdevVmlButton
                                                href="https://helix.ccstiet.com/"
                                                style="
                                                  height: 55px;
                                                  v-text-anchor: middle;
                                                  width: 222px;
                                                "
                                                arcsize="50%"
                                                strokecolor="#3d85c6"
                                                strokeweight="1px"
                                                fillcolor="#f8f4ec"
                                              >
                                                <w:anchorlock></w:anchorlock>
                                                <center
                                                  style="
                                                    color: #0f1932;
                                                    font-family: arial,
                                                      'helvetica neue', helvetica,
                                                      sans-serif;
                                                    font-size: 22px !important;
                                                    font-weight: 700;
                                                    line-height: 22px;
                                                    mso-text-raise: 1px;
                                                  "
                                                >
                                                  Register Now!
                                                </center>
                                              </v:roundrect></a
                                            > <!
                                          [endif]--><!--[if !mso]><!-- --><span
                                            class="msohide es-button-border-1706460746205 es-button-border"
                                            style="
                                              border-style: solid;
                                              border-color: #2cb543;
                                              background: #f8f4ec;
                                              border-width: 0px 0px 2px 0px;
                                              display: inline-block;
                                              border-radius: 30px;
                                              width: auto;
                                              mso-hide: all;
                                              border-bottom-width: 2px;
                                              border-right-width: 2px;
                                              border-bottom-color: #3d85c6;
                                              border-right-color: #3d85c6;
                                            "
                                            ><a
                                              href="https://helix.ccstiet.com/"
                                              class="es-button es-button-1706460746188 msohide"
                                              target="_blank"
                                              style="
                                                mso-style-priority: 100 !important;
                                                text-decoration: none !important;
                                                mso-line-height-rule: exactly;
                                                color: #0f1932;
                                                font-size: 22px !important;
                                                padding: 15px 25px;
                                                display: inline-block;
                                                background: #f8f4ec;
                                                border-radius: 30px;
                                                font-family: arial, 'helvetica neue',
                                                  helvetica, sans-serif;
                                                font-weight: bold;
                                                font-style: normal;
                                                line-height: 26px;
                                                width: auto;
                                                text-align: center;
                                                letter-spacing: 0;
                                                mso-padding-alt: 0;
                                                mso-border-alt: 10px solid #f8f4ec;
                                                mso-hide: all;
                                              "
                                              >Register Now!</a
                                            ></span
                                          ><!--<![endif]-->
                                        </td>
                                      </tr>
                                      <tr>
                                        <td
                                          align="center"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 20px;
                                            font-size: 0 !important;
                                          "
                                          bgcolor="#0f1932"
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
                                                  border-bottom: 3px solid #f8f4ec;
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
                                          bgcolor="#0f1932"
                                          style="
                                            padding: 0;
                                            margin: 0;
                                            padding-top: 10px;
                                            padding-bottom: 10px;
                                          "
                                        >
                                          <p
                                            style="
                                              margin: 0;
                                              mso-line-height-rule: exactly;
                                              font-family: roboto, 'helvetica neue',
                                                helvetica, arial, sans-serif;
                                              line-height: 32px;
                                              letter-spacing: 0;
                                              color: #f8f4ec;
                                              font-size: 21px !important;
                                            "
                                          >
                                            Dive into a spectrum of engaging
                                            activities as we present the dynamic
                                            lineup that defines Helix:
                                          </p>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </table>
                                </td>
                              </tr>
                            </table>
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            bgcolor="#0f1932"
                            style="padding: 0; margin: 0; background-color: #0f1932"
                          >
                            <!--[if mso]><table style="width:600px" cellpadding="0" cellspacing="0"><tr><td style="width:290px" valign="top"><![endif]-->
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              class="es-left"
                              align="left"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                float: left;
                              "
                            >
                              <tr>
                                <td
                                  class="es-m-p20b"
                                  align="left"
                                  style="padding: 0; margin: 0; width: 290px"
                                >
                                  <table
                                    cellpadding="0"
                                    cellspacing="0"
                                    width="100%"
                                    bgcolor="#0f1932"
                                    style="
                                      mso-table-lspace: 0pt;
                                      mso-table-rspace: 0pt;
                                      border-collapse: collapse;
                                      border-spacing: 0px;
                                      background-color: #0f1932;
                                    "
                                  >
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 15px;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/competitve_programming_contest.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="290"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          margin: 0;
                                          padding-top: 15px;
                                          padding-right: 25px;
                                          padding-left: 20px;
                                          padding-bottom: 10px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 32px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 21px !important;
                                            text-align: center;
                                          "
                                        >
                                          <b>Vortex&nbsp;</b>
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 30px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 20px !important;
                                          "
                                        >
                                          Diving into <strong>data science</strong>,
                                          participants analyze real-world scenarios,
                                          merging creativity with data-driven
                                          decision-making
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 15px;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/1.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="290" !important
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-left: 15px;
                                          padding-right: 15px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 32px;
                                            letter-spacing: 0px;
                                            color: #f8f4ec;
                                            font-size: 21px !important;
                                            text-align: center;
                                          "
                                        >
                                          <b>Speaker Session</b>
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 30px;
                                            letter-spacing: 0px;
                                            color: #f8f4ec;
                                            font-size: 20px !important;
                                          "
                                        >
                                          Bridging academia and industry, the
                                          <strong>Speaker Session</strong> at Helix
                                          provides practical insights from experts
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!--[if mso]></td><td style="width:20px"></td><td style="width:290px" valign="top"><![endif]-->
                            <table
                              cellpadding="0"
                              cellspacing="0"
                              class="es-right"
                              align="right"
                              style="
                                mso-table-lspace: 0pt;
                                mso-table-rspace: 0pt;
                                border-collapse: collapse;
                                border-spacing: 0px;
                                float: right;
                              "
                            >
                              <tr>
                                <td
                                  align="left"
                                  style="padding: 0; margin: 0; width: 290px"
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
                                        style="
                                          margin: 0;
                                          padding-bottom: 25px;
                                          padding-left: 10px;
                                          padding-right: 15px;
                                          padding-top: 20px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 32px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 21px !important;
                                            text-align: center;
                                          "
                                        >
                                          <strong>CP CONTEST</strong>
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 30px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 20px !important;
                                          "
                                        >
                                          A <strong>coding challenge</strong> at
                                          Helix, testing algorithmic skills and
                                          logical reasoning for computational
                                          excellence
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 15px;
                                          padding-bottom: 15px;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/2.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="290"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          margin: 0;
                                          padding-top: 25px;
                                          padding-bottom: 25px;
                                          padding-left: 10px;
                                          padding-right: 15px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 32px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 21px !important;
                                            text-align: center;
                                          "
                                        >
                                          <b>HACKTU 5.0</b>
                                        </p>
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 30px;
                                            letter-spacing: 0;
                                            color: #f8f4ec;
                                            font-size: 20px !important;
                                          "
                                        >
                                          A 24-hour <strong>Hackathon</strong> at
                                          Helix where teams innovate, turning ideas
                                          into reality
                                        </p>
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="center"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 40px;
                                          font-size: 0px !important;
                                        "
                                      >
                                        <img
                                          class="adapt-img"
                                          src="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/speaker.png"
                                          alt
                                          style="
                                            display: block;
                                            font-size: 14px !important;
                                            border: 0;
                                            outline: none;
                                            text-decoration: none;
                                          "
                                          width="290"
                                        />
                                      </td>
                                    </tr>
                                    <tr>
                                      <td
                                        align="left"
                                        style="
                                          padding: 0;
                                          margin: 0;
                                          padding-top: 5px;
                                          padding-left: 10px;
                                          padding-right: 15px;
                                        "
                                      >
                                        <p
                                          style="
                                            margin: 0;
                                            mso-line-height-rule: exactly;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            line-height: 42px;
                                            letter-spacing: 0;
                                            color: #333333;
                                            font-size: 28px !important;
                                          "
                                        >
                                          <b></b><b style="font-size: 22px !important"></b>
                                        </p>
                                      </td>
                                    </tr>
                                  </table>
                                </td>
                              </tr>
                            </table>
                            <!--[if mso]></td></tr></table><![endif]-->
                          </td>
                        </tr>
                        <tr>
                          <td
                            align="left"
                            bgcolor="#0f1932"
                            style="
                              padding: 0;
                              margin: 0;
                              padding-left: 40px;
                              padding-right: 40px;
                              background-color: #0f1932;
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
                                        bgcolor="#0f1932"
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
                                                border-bottom: 3px solid #f8f4ec;
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
                              background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png);
                              background-repeat: no-repeat;
                              background-position: left top;
                            "
                            background="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png"
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
                                          padding-bottom: 20px;
                                          font-size: 0 !important;
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
                                                  font-size:  14px !important;
                                                "
                                                ><img
                                                  title="Linkedin"
                                                  src="https://xizznc.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png"
                                                  alt="In"
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