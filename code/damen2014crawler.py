# Name: Floris D Stevens
# Student number: 10182195

'''
This script scrapes the time-team.nl website and outputs results in a JSON file with the starting time, crew names, lanes and results
'''
import csv, json
from pattern.web import URL, DOM, plaintext, abs

TARGET_URL = "http://regatta.time-team.nl/raceroei/2014/results/heats.php"
OUTPUT_JSON = "damen2014.json"

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
    for index in range(0,2):
        dag = heat_urls[index]
        for i, url in enumerate(dag):
        #for i in range (0,10):
        #    url = dag[i]    
            heat_html = URL(url).download(cached=True)
            # Extract relevant information for each movie
            heat_dom = DOM(heat_html)
            chart = heat_dom.by_tag("div")[8]
            # Extract discriptional data from the heat
            discription = chart.by_tag("h2")[0].content 
            day = str((discription[:3]))
            time = str(discription[3:8])
            field = str(discription[8:])
            
            # Extract results from the heat, divided into: crew: lane and 500m/1000m/1500m/2000m: time/position.
            rows = chart.by_tag("tr")[2:]
            for j in range(0, len(rows), 2):
                heat = []
                row = rows[j]
                # Skip crews who did not start the race.
                try:
                    result = row.by_tag("td")[0].content
                except IndexError:
                    j +=1
                    continue 
                if (result != "" and result != "." ):   
                    crew = row.by_tag("td")[2].by_tag("a")[0].content
                    k = 3
                    # some pages have an extra td element with irrelevant data, so we increment k by one.
                    if (len(chart.by_tag("tr")[1]) > 9):
                        k += 1
                    lane = row.by_tag("td")[k].content
                    k += 1
                
                    # Results are divided in 500m, 1000m, 1500m and finish. all points have a time and a position value.
                    interval = {}
                    interval_500 = {}
                    interval["500m"] = interval_500
                    interval_500["time"] = row.by_tag("td")[k].content
                    k += 1
                    interval_500["position"] = row.by_tag("td")[k].content
                    k += 1
                        
                    interval_1000 = {}
                    interval["1000m"] = interval_1000
                    interval_1000["time"] = row.by_tag("td")[k].content
                    k += 1
                    interval_1000["position"] = row.by_tag("td")[k].content
                    k += 1
                        
                    interval_1500 = {}
                    interval["1500m"] = interval_1500
                    interval_1500["time"] = row.by_tag("td")[k].content
                    k += 1
                    interval_1500["position"] = row.by_tag("td")[k].content
                    k += 1
                
                    finish = {}
                    interval["finish"] = finish
                    finish["time"] = row.by_tag("td")[k].content
                    k += 1
                    finish["position"] = row.by_tag("td")[k].content

                    results = {}
                    results["results"] = interval    
                    heat.append(day)
                    heat.append(time)
                    heat.append(field)
                    heat.append(crew)
                    heat.append(results)
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

