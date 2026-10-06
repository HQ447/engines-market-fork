import json
import re
from pathlib import Path

text = Path("lib/resourceContent.ts").read_text(encoding="utf-8")


def extract(const_name: str):
    match = re.search(rf"export const {const_name}[^=]*=\s*\[(.*?)\];", text, re.S)
    if not match:
        return []
    block = match.group(1)
    return [
        {"label": label, "href": href}
        for label, href in re.findall(r'label:\s*"([^"]+)".*?href:\s*"([^"]+)"', block, re.S)
    ]


prices = extract("priceResourceLinks")
failures = extract("failureResourceLinks")
compare = extract("compareResourceLinks")
cases = extract("caseStudyResourceLinks")
insights = extract("insightResourceLinks")
symptoms = extract("symptomLinks")
guides = extract("guideLinks")

others = {
    "groups": [
        {
            "title": "Prices",
            "links": prices,
            "viewAll": {"label": "All Price Guides", "href": "/prices"},
        },
        {
            "title": "Case Studies",
            "links": cases,
            "viewAll": {"label": "All Case Studies", "href": "/case-studies"},
        },
        {
            "title": "Failures",
            "links": failures,
            "viewAll": {"label": "All Failures", "href": "/failures"},
        },
        {
            "title": "Symptoms",
            "links": symptoms,
            "viewAll": {"label": "All Symptoms", "href": "/symptoms"},
        },
        {
            "title": "Compare",
            "links": compare,
            "viewAll": {"label": "All Comparisons", "href": "/compare"},
        },
        {
            "title": "Insights",
            "links": insights,
            "viewAll": {"label": "All Insights", "href": "/insights"},
        },
        {
            "title": "Guides",
            "links": guides,
            "viewAll": {"label": "All Resources", "href": "/resources"},
        },
        {
            "title": "Knowledge",
            "links": [
                {"label": "Engine Failures", "href": "/failures"},
                {"label": "Car Symptoms", "href": "/symptoms"},
                {"label": "Compare Options", "href": "/compare"},
                {"label": "Case Studies", "href": "/case-studies"},
                {"label": "Guides & Tools", "href": "/guides"},
                {"label": "All Resources", "href": "/resources"},
            ],
        },
        {
            "title": "Company",
            "links": [
                {"label": "About Us", "href": "/about"},
                {"label": "How It Works", "href": "/about/how-engines-market-works"},
                {"label": "Supplier Standards", "href": "/about/supplier-standards"},
                {"label": "Reviews", "href": "/reviews"},
                {"label": "Contact", "href": "/about/contact"},
                {"label": "Blog", "href": "/blog"},
                {"label": "Locations", "href": "/locations"},
            ],
        },
        {
            "title": "Legal",
            "links": [
                {"label": "Privacy Policy", "href": "/legal/privacy-policy"},
                {"label": "Terms & Conditions", "href": "/legal/terms-and-conditions"},
                {"label": "Cookie Policy", "href": "/legal/cookie-policy"},
                {"label": "Complaints Procedure", "href": "/legal/complaints-procedure"},
                {"label": "Data Handling Policy", "href": "/legal/data-handlng-policy"},
            ],
            "viewAll": {"label": "Legal Hub", "href": "/legal"},
        },
    ]
}

Path("data/nav/others.json").write_text(
    json.dumps(others, indent=2, ensure_ascii=False) + "\n",
    encoding="utf-8",
)

print(
    "prices",
    len(prices),
    "cases",
    len(cases),
    "failures",
    len(failures),
    "symptoms",
    len(symptoms),
    "compare",
    len(compare),
    "insights",
    len(insights),
    "guides",
    len(guides),
)
