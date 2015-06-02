# Name: Floris D Stevens
# Student number: 10182195

'''
This script scrapes the time-team.nl website and outputs results in a JSON file with the starting time, crew names, lanes
'''
import csv, json
from pattern.web import URL, DOM, plaintext, abs

TARGET_URL = "http://regatta.time-team.nl/raceroei/2015/results/heats.php"
OUTPUT_JSON = "damen2015.json"

def scrape_heat_urls(dom):
    days = []
    for i in range(1,3):
        temp = dom.by_tag("table")[i]
        day = temp.by_tag("th")[1].content
        rows = temp.by_tag("tr")[1:]
        heat_urls = []
        for row in rows:
            partial_url = row.by_tag("a")[0]
            heat_url = abs(partial_url.attributes.get('href',''), base=url.redirect or url.string)
            heat_urls.append(heat_url)
        days.append(heat_urls)
    return days


def scrape_heats(heat_urls):
    heats = []
    for i in range(0,2):
        dag = heat_urls[i] # LET OP 0 moet hier i worden!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
        #for i, url in enumerate(dag):
            # Grab web page
        heat = []
        for i in range (0,4):
            url = dag[i]    
            heat_html = URL(url).download(cached=True)
            # Extract relevant information for each movie
            heat_dom = DOM(heat_html)
            chart = heat_dom.by_tag("div")[8]
            # Extract discriptional data from the heat
            discription = chart.by_tag("h2")[0].content 
            day = str((discription[:3]))
            time = str(discription[3:8])
            field = str(discription[8:])
            
            # Extract results from the heat, divided into: crew, lane and 500m/1000m/1500m/2000m: time/position.
            

            heat.append(day)
            heat.append(time)
            heat.append(field)
            heats.append(heat)
    return heats

if __name__ == '__main__':
    # Download the HTML file
    url = URL(TARGET_URL)
    html = url.download()

    # Parse the HTML file into a DOM representation
    dom = DOM(html)

    # Extract the tv series (using the function you implemented)
    heat_urls = scrape_heat_urls(dom)
    heats = scrape_heats(heat_urls)
    out_file = open(OUTPUT_JSON,"w")
    json.dump(heats,out_file)

