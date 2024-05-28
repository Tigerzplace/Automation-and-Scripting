function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  
  const baseUrl = "https://kodesouls.com/dev0/justgiveonline/wp-admin/admin-ajax.php";
  let postID = 22255;
  
  async function fetchData() {
    try {
      const response = await fetch("https://kodesouls.com/dev0/justgiveonline/json.txt");
      const data = await response.json();
      for (const charity of data) {
        postID = createPost();
        await sendCharityData(charity);
        let waitTime = Math.random() * 2000 + 1000;
        await sleep(waitTime);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }

  
  async function sendCharityData(charity) {
    const nonce = 'c08c200e27';
    const title = `${charity.name} ${charity.country} ${charity.id}`;
    const registration_number = charity.registration_number;
    const email = charity.email;
    const website = charity.website;
    const address = charity.address;
    const postcode = charity.postcode;
    const description = charity.description;
    const image_url = encodeURIComponent(charity.logo_url);
  
    const elements = [
      {
        id: "be604fc",
        elType: "section",
        isInner: false,
        isLocked: false,
        settings: { structure: "20" },
        elements: [
          {
            id: "60b3a4d",
            elType: "column",
            isInner: false,
            isLocked: false,
            settings: { _column_size: 50, inline_size: null },
            elements: [
              {
                id: "eb3ac65",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  selected_icon: { value: "fab fa-first-order", library: "fa-brands" },
                  view: "framed",
                  title_text: "Charity #",
                  description_text: registration_number,
                  position: "left",
                  content_vertical_alignment: "middle",
                  primary_color: "#A216B3",
                  icon_size: { unit: "px", size: 35, sizes: [] },
                  title_size: "h4",
                  content_vertical_alignment_mobile: "middle"
                },
                elements: [],
                widgetType: "icon-box"
              },
              {
                id: "7b0faf1",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  selected_icon: { value: "fas fa-envelope", library: "fa-solid" },
                  view: "framed",
                  title_text: "Email",
                  description_text: email,
                  position: "left",
                  content_vertical_alignment: "middle",
                  primary_color: "#A216B3",
                  icon_size: { unit: "px", size: 35, sizes: [] },
                  title_size: "h4",
                  text_align: "left",
                  text_align_mobile: "center"
                },
                elements: [],
                widgetType: "icon-box"
              },
              {
                id: "12c0e97",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  selected_icon: { value: "fas fa-external-link-square-alt", library: "fa-solid" },
                  view: "framed",
                  title_text: "Website",
                  description_text: website,
                  position: "left",
                  content_vertical_alignment: "middle",
                  primary_color: "#A216B3",
                  icon_size: { unit: "px", size: 35, sizes: [] },
                  title_size: "h4",
                  text_align: "left",
                  text_align_mobile: "center"
                },
                elements: [],
                widgetType: "icon-box"
              },
              {
                id: "fd03ae7",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  selected_icon: { value: "fas fa-home", library: "fa-solid" },
                  view: "framed",
                  title_text: "Address",
                  description_text: address,
                  position: "left",
                  content_vertical_alignment: "middle",
                  primary_color: "#A216B3",
                  icon_size: { unit: "px", size: 35, sizes: [] },
                  icon_size_tablet: { unit: "%", size: "", sizes: [] },
                  icon_size_mobile: { unit: "%", size: "", sizes: [] },
                  title_size: "h4"
                },
                elements: [],
                widgetType: "icon-box"
              },
              {
                id: "242c75d",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  selected_icon: { value: "fas fa-box", library: "fa-solid" },
                  view: "framed",
                  title_text: "Postal Code",
                  description_text: postcode,
                  position: "left",
                  content_vertical_alignment: "middle",
                  primary_color: "#A216B3",
                  icon_size: { unit: "px", size: 35, sizes: [] },
                  title_size: "h4"
                },
                elements: [],
                widgetType: "icon-box"
              }
            ]
          },
          {
            id: "40764e0",
            elType: "column",
            isInner: false,
            isLocked: false,
            settings: { _column_size: 50, inline_size: null },
            elements: [
              {
                id: "92d1980",
                elType: "widget",
                isInner: false,
                isLocked: false,
                settings: {
                  editor: `<p><a class="charity_logo" href="#"><img class="alignleft" src="${image_url}" alt="" width="175" height="142"></a>${description}</p>`,
                  align: "justify"
                },
                elements: [],
                widgetType: "text-editor"
              }
            ]
          }
        ]
      },
      {
        id: "dbb4df7",
        elType: "section",
        isInner: false,
        isLocked: false,
        settings: {},
        elements: [
          {
            id: "f31a487",
            elType: "column",
            isInner: false,
            isLocked: false,
            settings: { _column_size: 100, inline_size: null },
            elements: []
          }
        ]
      }
    ];
  
    const settings = {
      post_title: title,
      post_status: "publish"
    };
  
    const params = {
      actions: JSON.stringify({ save_builder: { action: "save_builder", data: { status: "publish", elements: elements, settings: settings } } }),
      _nonce: nonce,
      editor_post_id: postID,
      initial_document_id: postID,
      action: "elementor_ajax"
    };
  
    const xhr = new XMLHttpRequest();
    xhr.open("POST", baseUrl, true);
    xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xhr.setRequestHeader("Accept", "application/json, text/javascript, */*; q=0.01");
    xhr.setRequestHeader("Accept-Language", "en-US,en;q=0.9");
    xhr.setRequestHeader("Priority", "u=1, i");
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  
    // Add cookies from document.cookie
    //const cookies = getCookies();
    //xhr.setRequestHeader("Cookie", Object.entries(cookies).map(([name, value]) => `${name}=${value}`).join("; "));
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          if (response.success) {
            console.log("Request successful for charity:", charity.name);
            postID += 1;
          } else {
            console.error("Request failed for charity:", charity.name);
          }
        } else {
          console.error("Request failed with status:", xhr.status, "for charity:", charity.name);
        }
      }
    };
  
    xhr.send(new URLSearchParams(params).toString());
  }
  
  // Start the process
  fetchData();
  