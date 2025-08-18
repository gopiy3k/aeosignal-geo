# -----------------------------
# Submit-IndexNow-Final-With-Namespace.ps1
# Automatically submits only new/updated valid URLs from sitemap to IndexNow
# Handles XML namespaces in sitemap
# -----------------------------

# -----------------------------
# CONFIGURATION
# -----------------------------
$domain = "aeosignal.space"
$apiKey = "33b9c5bc991a4c07aef3600da439cb17"
$keyLocation = "https://aeosignal.space/33b9c5bc991a4c07aef3600da439cb17.txt"
$sitemapUrl = "https://aeosignal.space/sitemap.xml"
$cacheFile = "$PSScriptRoot\submitted_urls.txt"  # Tracks previously submitted URLs

# -----------------------------
# FETCH SITEMAP WITH NAMESPACE SUPPORT
# -----------------------------
Write-Host "Fetching sitemap..."
try {
    $sitemapContent = Invoke-WebRequest -Uri $sitemapUrl -UseBasicParsing
    [xml]$sitemapXml = $sitemapContent.Content

    # Handle default namespace
    $nsMgr = New-Object System.Xml.XmlNamespaceManager($sitemapXml.NameTable)
    $nsMgr.AddNamespace("s", $sitemapXml.DocumentElement.NamespaceURI)

    # Select all <loc> nodes in the sitemap
    $allUrls = $sitemapXml.SelectNodes("//s:url/s:loc", $nsMgr) | ForEach-Object { $_.InnerText.Trim() }

} catch {
    Write-Host "❌ Failed to fetch or parse sitemap: $_"
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Found $($allUrls.Count) URLs in sitemap."

# -----------------------------
# LOAD SUBMITTED URLS CACHE
# -----------------------------
$submittedUrls = @()
if (Test-Path $cacheFile) {
    $submittedUrls = Get-Content $cacheFile | ForEach-Object { $_.Trim() }
}

# -----------------------------
# FILTER NEW AND VALID URLs
# -----------------------------
$newUrls = $allUrls |
    Where-Object { $_ -notin $submittedUrls } |   # Not already submitted
    Where-Object { $_ -match '^https?://.+' }     # Only valid HTTP/HTTPS URLs

if ($newUrls.Count -eq 0) {
    Write-Host "No new valid URLs to submit. All URLs have been submitted before."
    Read-Host "Press Enter to exit"
    exit
}

Write-Host "Submitting $($newUrls.Count) new valid URL(s) to IndexNow..."

# -----------------------------
# PREPARE PAYLOAD
# -----------------------------
$payload = @{
    host = $domain
    key = $apiKey
    keyLocation = $keyLocation
    urlList = $newUrls
} | ConvertTo-Json

# -----------------------------
# SUBMIT TO INDEXNOW
# -----------------------------
try {
    $response = Invoke-WebRequest -Uri "https://api.indexnow.org/IndexNow" -Method Post -ContentType "application/json" -Body $payload
    Write-Host "HTTP Status Code: $($response.StatusCode)"
    if ($response.StatusCode -eq 200) {
        Write-Host "✅ URLs submitted successfully!"
        # Update cache file with all URLs
        $allUrls | Set-Content $cacheFile
    } else {
        Write-Host "⚠️ Submission failed. Status code: $($response.StatusCode)"
    }
} catch {
    Write-Host "❌ Submission failed: $_"
}

Read-Host "Press Enter to exit"
