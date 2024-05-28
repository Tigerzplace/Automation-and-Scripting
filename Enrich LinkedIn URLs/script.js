function extractCompanyDetails(html, companyId) {
    // Create a DOM parser
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');
    
    // Find all the code blocks in the document
    const codeBlocks = doc.querySelectorAll('code[id^="bpr-guid"]');
    
    for (const codeBlock of codeBlocks) {
        // Extract the JSON content inside the code block
        let jsonText = codeBlock.textContent.trim();
        
        try {
            const jsonContent = JSON.parse(jsonText);
            
            if (jsonContent.included) {
                for (const item of jsonContent.included) {
                    if (item.entityUrn && item.entityUrn.includes(companyId)) {
                        const companyUrl = item.url && item.url.includes('/company/') ? item.url : null;
                        const websiteUrl = item.websiteUrl || 'N/A';
                        const universalName = item.universalName || 'N/A';

                        if (companyUrl) {
                            return {
                                url: companyUrl,
                                website: websiteUrl,
                                name: universalName
                            };
                        }
                    }
                }
            }
        } catch (e) {
            console.error("Error parsing JSON content:", e);
        }
    }
    
    // If no URL is found, return null
    return null;
}

// Function to fetch the HTML content from the given URL and extract company details
function getCompanyDetails(url) {
    // Extract the company ID from the URL
    const companyId = url.split('/').filter(part => part).pop();

    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
  
    xhr.setRequestHeader('accept', 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7');
    xhr.setRequestHeader('accept-language', 'en-US,en;q=0.9');
    xhr.setRequestHeader('priority', 'u=0, i');
    xhr.setRequestHeader('upgrade-insecure-requests', '1');
  
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const html = xhr.responseText;
        const companyDetails = extractCompanyDetails(html, companyId);
  
        if (companyDetails) {
          console.log('Company Details:', companyDetails);
          alert(`Found!!!\nName: ${companyDetails.name}\nWebsite: ${companyDetails.website}\nURL: ${companyDetails.url}`);
        } else {
          console.log('No company details found.');
        }
      }
    };
  
    xhr.send(null);
}

// Get the URL from user prompt
const url = prompt('Enter LinkedIn company URL:', 'https://www.linkedin.com/company/65402157/');
getCompanyDetails(url);
