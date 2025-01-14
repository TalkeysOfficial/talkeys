exports.eventTemplate=function (EventName,Name,Venue,Time){
  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
  <html
    dir="ltr"
    xmlns="http://www.w3.org/1999/xhtml"
    xmlns:o="urn:schemas-microsoft-com:office:office"
    lang="en"
  >
    <head>
      <meta charset="UTF-8" />
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="x-apple-disable-message-reformatting" />
      <meta http-equiv="X-UA-Compatible" content="IE=edge" />
      <meta content="telephone=no" name="format-detection" />
      <title>Empty template</title>
      <!--[if (mso 16)]>
        <style type="text/css">
          a {
            text-decoration: none;
          }
        </style>
      <![endif]-->
      <!--[if gte mso 9
        ]><style>
          sup {
            font-size: 100% !important;
          }
        </style><!
      [endif]-->
      <!--[if gte mso 9]>
        <xml>
          <o:OfficeDocumentSettings>
            <o:AllowPNG></o:AllowPNG>
            <o:PixelsPerInch>96</o:PixelsPerInch>
          </o:OfficeDocumentSettings>
        </xml>
      <![endif]-->
      <!--[if !mso]><!-- -->
      <link
        href="https://fonts.googleapis.com/css?family=Roboto:400,400i,700,700i"
        rel="stylesheet"
      />
      <!--<![endif]-->
      <style type="text/css">
        #outlook a {
          padding: 0;
        }
        .es-button {
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
        [data-ogsb] .es-button.es-button-1706811821679 {
          padding: 15px 25px !important;
        }
        @media only screen and (max-width: 600px) {
          p,
          ul li,
          ol li,
          a {
            line-height: 150% !important;
          }
          h1,
          h2,
          h3,
          h1 a,
          h2 a,
          h3 a {
            line-height: 120% !important;
          }
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
          .es-header-body h1 a,
          .es-content-body h1 a,
          .es-footer-body h1 a {
            font-size: 30px !important;
            text-align: left;
          }
          .es-header-body h2 a,
          .es-content-body h2 a,
          .es-footer-body h2 a {
            font-size: 24px !important;
            text-align: left;
          }
          .es-header-body h3 a,
          .es-content-body h3 a,
          .es-footer-body h3 a {
            font-size: 20px !important;
            text-align: left;
          }
          .es-menu td a {
            font-size: 14px !important;
          }
          .es-header-body p,
          .es-header-body ul li,
          .es-header-body ol li,
          .es-header-body a {
            font-size: 14px !important;
          }
          .es-content-body p,
          .es-content-body ul li,
          .es-content-body ol li,
          .es-content-body a {
            font-size: 14px !important;
          }
          .es-footer-body p,
          .es-footer-body ul li,
          .es-footer-body ol li,
          .es-footer-body a {
            font-size: 14px !important;
          }
          .es-infoblock p,
          .es-infoblock ul li,
          .es-infoblock ol li,
          .es-infoblock a {
            font-size: 12px !important;
          }
          *[class="gmail-fix"] {
            display: none !important;
          }
          .es-m-txt-c,
          .es-m-txt-c h1,
          .es-m-txt-c h2,
          .es-m-txt-c h3 {
            text-align: center !important;
          }
          .es-m-txt-r,
          .es-m-txt-r h1,
          .es-m-txt-r h2,
          .es-m-txt-r h3 {
            text-align: right !important;
          }
          .es-m-txt-l,
          .es-m-txt-l h1,
          .es-m-txt-l h2,
          .es-m-txt-l h3 {
            text-align: left !important;
          }
          .es-m-txt-r img,
          .es-m-txt-c img,
          .es-m-txt-l img {
            display: inline !important;
          }
          .es-button-border {
            display: inline-block !important;
          }
          a.es-button,
          button.es-button {
            font-size: 18px !important;
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
          .es-adapt-td {
            display: block !important;
            width: 100% !important;
          }
          .adapt-img {
            width: 100% !important;
            height: auto !important;
            max-width: 280px !important;
          }
          .es-m-p0 {
            padding: 0px !important;
          }
          .es-m-p0r {
            padding-right: 0px !important;
          }
          .es-m-p0l {
            padding-left: 0px !important;
          }
          .es-m-p0t {
            padding-top: 0px !important;
          }
          .es-m-p0b {
            padding-bottom: 0 !important;
          }
          .es-m-p20b {
            padding-bottom: 20px !important;
          }
          .es-mobile-hidden,
          .es-hidden {
            display: none !important;
          }
          tr.es-desk-hidden,
          td.es-desk-hidden,
          table.es-desk-hidden {
            width: auto !important;
            overflow: visible !important;
            float: none !important;
            max-height: inherit !important;
            line-height: inherit !important;
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
          table.es-social {
            display: inline-block !important;
          }
          table.es-social td {
            display: inline-block !important;
          }
          .es-desk-hidden {
            display: table-row !important;
            width: auto !important;
            overflow: visible !important;
            max-height: inherit !important;
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
      style="
        width: 100%;
        font-family: arial, 'helvetica neue', helvetica, sans-serif;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
        padding: 0;
        margin: 0;
      "
    >
      <div
        dir="ltr"
        class="es-wrapper-color"
        lang="en"
        style="background-color: #f6f6f6"
      >
        <!--[if gte mso 9]>
          <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
            <v:fill type="tile" color="#f6f6f6"></v:fill>
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
            background-color: #f6f6f6;
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
                  table-layout: fixed !important;
                  width: 100%;
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
                        <td
                          align="left"
                          background="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                            background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png);
                            background-repeat: no-repeat;
                            background-position: left top;
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
                                  background="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png"
                                  style="
                                    mso-table-lspace: 0pt;
                                    mso-table-rspace: 0pt;
                                    border-collapse: collapse;
                                    border-spacing: 0px;
                                    background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png);
                                    background-repeat: no-repeat;
                                    background-position: left top;
                                  "
                                >
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-bottom: 20px;
                                        font-size: 0px;
                                      "
                                    >
                                      <img
                                        class="adapt-img"
                                        src="https://echwjve.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/tracedlogo_1.png"
                                        alt
                                        style="
                                          display: block;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                          -ms-interpolation-mode: bicubic;
                                        "
                                        width="350"
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
                class="es-content"
                cellspacing="0"
                cellpadding="0"
                align="center"
                style="
                  mso-table-lspace: 0pt;
                  mso-table-rspace: 0pt;
                  border-collapse: collapse;
                  border-spacing: 0px;
                  table-layout: fixed !important;
                  width: 100%;
                "
              >
                <tr>
                  <td align="center" style="padding: 0; margin: 0">
                    <table
                      class="es-content-body"
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
                        <td
                          align="left"
                          bgcolor="#0f1932"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 5px;
                            padding-left: 20px;
                            padding-right: 20px;
                            background-color: #0f1932;
                          "
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
                                valign="top"
                                align="center"
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
                                        font-size: 0px;
                                      "
                                    >
                                      <img
                                        class="adapt-img"
                                        src="https://echwjve.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/helixlogo.png"
                                        alt
                                        style="
                                          display: block;
                                          border: 0;
                                          outline: none;
                                          text-decoration: none;
                                          -ms-interpolation-mode: bicubic;
                                        "
                                        width="309"
                                      />
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 20px;
                                        margin: 0;
                                        font-size: 0;
                                      "
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
                          bgcolor="#0f1932"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                            background-color: #0f1932;
                          "
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
                                valign="top"
                                align="center"
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
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 54px;
                                          color: #f8f4ec;
                                          font-size: 36px;
                                        "
                                      >
                                        <strong>Thank You for Registering</strong>
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-top: 25px;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: arial, 'helvetica neue',
                                            helvetica, sans-serif;
                                          line-height: 39px;
                                          color: #f8f4ec;
                                          font-size: 26px;
                                        "
                                      >
                                        Hi ${Name}, You Have been successfully
                                        registered for ${EventName}!&nbsp;
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-top: 25px;
                                      "
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: roboto, 'helvetica neue',
                                            helvetica, arial, sans-serif;
                                          line-height: 39px;
                                          color: #f8f4ec;
                                          font-size: 26px;
                                        "
                                      >
                                        <strong>Venue: </strong>${Venue}
                                      </p>
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: roboto, 'helvetica neue',
                                            helvetica, arial, sans-serif;
                                          line-height: 39px;
                                          color: #f8f4ec;
                                          font-size: 26px;
                                        "
                                      >
                                        <strong>Time:</strong> ${Time}
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="padding: 0; margin: 0"
                                    >
                                      <p
                                        style="
                                          margin: 0;
                                          -webkit-text-size-adjust: none;
                                          -ms-text-size-adjust: none;
                                          mso-line-height-rule: exactly;
                                          font-family: roboto, 'helvetica neue',
                                            helvetica, arial, sans-serif;
                                          line-height: 32px;
                                          color: #f8f4ec;
                                          font-size: 21px;
                                        "
                                      >
                                        <br />
                                      </p>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        padding: 0;
                                        margin: 0;
                                        padding-bottom: 10px;
                                      "
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
                                              height: 56px;
                                              v-text-anchor: middle;
                                              width: 198px;
                                            "
                                            arcsize="50%"
                                            stroke="f"
                                            fillcolor="#f8f4ec"
                                          >
                                            <w:anchorlock></w:anchorlock>
                                            <center
                                              style="
                                                color: #0f1932;
                                                font-family: arial,
                                                  'helvetica neue', helvetica,
                                                  sans-serif;
                                                font-size: 22px;
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
                                        class="msohide es-button-border"
                                        style="
                                          border-style: solid;
                                          border-color: #2cb543;
                                          background: #f8f4ec;
                                          border-width: 0px 0px 2px 0px;
                                          display: inline-block;
                                          border-radius: 30px;
                                          width: auto;
                                          mso-hide: all;
                                          border-bottom-color: #3d85c6;
                                          border-right-color: #3d85c6;
                                          border-bottom-width: 1px;
                                          border-right-width: 1px;
                                        "
                                        ><a
                                          href="https://helix.ccstiet.com/"
                                          class="es-button es-button-1706811821679"
                                          style="
                                            mso-style-priority: 100 !important;
                                            text-decoration: none;
                                            -webkit-text-size-adjust: none;
                                            -ms-text-size-adjust: none;
                                            mso-line-height-rule: exactly;
                                            color: #0f1932;
                                            font-size: 22px;
                                            display: inline-block;
                                            background: #f8f4ec;
                                            border-radius: 30px;
                                            font-family: arial, 'helvetica neue',
                                              helvetica, sans-serif;
                                            font-weight: normal;
                                            font-style: normal;
                                            line-height: 26px;
                                            width: auto;
                                            text-align: center;
                                            padding: 15px 25px;
                                            mso-padding-alt: 0;
                                            mso-border-alt: 10px solid #f8f4ec;
                                          "
                                          target="_blank"
                                          >Website Link</a
                                        ></span
                                      ><!--<![endif]-->
                                    </td>
                                  </tr>
                                  <tr>
                                    <td
                                      align="center"
                                      style="
                                        margin: 0;
                                        padding-left: 20px;
                                        padding-right: 20px;
                                        padding-top: 25px;
                                        padding-bottom: 30px;
                                        font-size: 0;
                                      "
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
                  table-layout: fixed !important;
                  width: 100%;
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
                        <td
                          align="left"
                          background="https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png"
                          style="
                            padding: 0;
                            margin: 0;
                            padding-top: 20px;
                            padding-left: 20px;
                            padding-right: 20px;
                            background-image: url(https://xizznc.stripocdn.email/content/guids/CABINET_5618bf179fb88bd125c32a2e8f428836c2a7dc08b7f0fb49b652447f1630db8a/images/light_blue_s3b.png);
                            background-repeat: no-repeat;
                            background-position: left top;
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
                                        padding-bottom: 10px;
                                        font-size: 0;
                                      "
                                    >
                                      <table
                                        cellpadding="0"
                                        cellspacing="0"
                                        class="es-table-not-adapt es-social"
                                        dir="ltr"
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
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #2cb543;
                                                font-size: 14px;
                                              "
                                              ><img
                                                src="https://echwjve.stripocdn.email/content/assets/img/social-icons/circle-colored/instagram-circle-colored.png"
                                                alt="Ig"
                                                title="Instagram"
                                                width="32"
                                                height="32"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
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
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #2cb543;
                                                font-size: 14px;
                                              "
                                              ><img
                                                src="https://echwjve.stripocdn.email/content/assets/img/social-icons/circle-colored/youtube-circle-colored.png"
                                                alt="Yt"
                                                title="Youtube"
                                                width="32"
                                                height="32"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
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
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #2cb543;
                                                font-size: 14px;
                                              "
                                              ><img
                                                src="https://echwjve.stripocdn.email/content/assets/img/social-icons/circle-colored/linkedin-circle-colored.png"
                                                alt="In"
                                                title="Linkedin"
                                                width="32"
                                                height="32"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
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
                                              href="https://discord.gg/YCe6vc2AeE"
                                              style="
                                                -webkit-text-size-adjust: none;
                                                -ms-text-size-adjust: none;
                                                mso-line-height-rule: exactly;
                                                text-decoration: underline;
                                                color: #2cb543;
                                                font-size: 14px;
                                              "
                                              ><img
                                                src="https://echwjve.stripocdn.email/content/assets/img/messenger-icons/circle-colored/discort-circle-colored.png"
                                                alt="Discord"
                                                title="Discord"
                                                width="32"
                                                height="32"
                                                style="
                                                  display: block;
                                                  border: 0;
                                                  outline: none;
                                                  text-decoration: none;
                                                  -ms-interpolation-mode: bicubic;
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