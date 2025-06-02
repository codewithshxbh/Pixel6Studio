<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">    <xsl:output method="html" encoding="UTF-8" indent="yes" media-type="text/html" />
    
    <xsl:template match="/">
        <html>
            <head>
                <title>XML Sitemap - PixelSix Studio</title>
                <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
                    body {
                        font-family: 'Poppins', Arial, sans-serif;
                        line-height: 1.5;
                        color: #f8fafc;
                        max-width: 1200px;
                        margin: 0 auto;
                        padding: 20px;
                        background-color: #151a21;
                    }
                    
                    header {
                        text-align: center;
                        padding: 20px 0;
                        margin-bottom: 30px;
                        border-bottom: 1px solid #323945;
                    }
                    
                    h1 {
                        font-size: 28px;
                        color: #a25aff;
                        margin-bottom: 10px;
                    }
                    
                    .subtitle {
                        font-size: 16px;
                        color: #a4b0c4;
                    }
                    
                    table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 20px;
                        background-color: #252a33;
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
                        border-radius: 6px;
                        overflow: hidden;
                    }
                    
                    th {
                        background-color: #7937c9;
                        color: #f8fafc;
                        padding: 15px;
                        text-align: left;
                    }
                    
                    td {
                        padding: 15px;
                        border-top: 1px solid #323945;
                    }
                    
                    tr:hover {
                        background-color: #1e242c;
                    }
                    
                    .url {
                        color: #b88aff;
                        text-decoration: none;
                        font-weight: 500;
                    }
                    
                    .url:hover {
                        text-decoration: underline;
                    }
                    
                    .priority-high {
                        background-color: #1e3a30;
                    }
                    
                    .priority-medium {
                        background-color: #3a331e;
                    }
                    
                    footer {
                        margin-top: 30px;
                        text-align: center;
                        font-size: 14px;
                        color: #a4b0c4;
                        border-top: 1px solid #323945;
                        padding-top: 20px;
                    }
                    
                    @media (max-width: 768px) {
                        table {
                            display: block;
                            overflow-x: auto;
                        }
                    }
                </style>
            </head>
            <body>
                <header>
                    <h1>PixelSix Studio - XML Sitemap</h1>
                    <div class="subtitle">                        This sitemap contains <xsl:value-of select="count(sitemap:urlset/sitemap:url)" /> URLs.
                        <br />
                        This sitemap was generated for PixelSix Studio.
                    </div>
                </header>
                
                <table>
                    <tr>
                        <th>URL</th>
                        <th>Last Modified</th>
                        <th>Change Frequency</th>
                        <th>Priority</th>
                        <th>Images</th>
                    </tr>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <xsl:variable name="priorityClass">
                            <xsl:choose>
                                <xsl:when test="sitemap:priority >= 0.8">priority-high</xsl:when>
                                <xsl:when test="sitemap:priority >= 0.5">priority-medium</xsl:when>
                                <xsl:otherwise></xsl:otherwise>
                            </xsl:choose>
                        </xsl:variable>
                        <tr class="{$priorityClass}">
                            <td>
                                <a href="{sitemap:loc}" class="url" target="_blank">
                                    <xsl:value-of select="sitemap:loc" />
                                </a>
                            </td>
                            <td>
                                <xsl:value-of select="sitemap:lastmod" />
                            </td>
                            <td>
                                <xsl:value-of select="sitemap:changefreq" />
                            </td>
                            <td>
                                <xsl:value-of select="sitemap:priority" />
                            </td>
                            <td>
                                <xsl:value-of select="count(image:image)" />
                            </td>
                        </tr>
                    </xsl:for-each>
                </table>
                
                <footer>
                    <p>© 2023 PixelSix Studio. This sitemap is designed to be used by search engines and related services.</p>
                    <p>
                        <a href="https://pixelsixstudio.live" style="color: #a25aff; text-decoration: none;">Return to Homepage</a>
                    </p>
                </footer>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>
