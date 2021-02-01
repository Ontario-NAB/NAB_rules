'use strict'

const accordionparent = document.querySelector('#NABaccordion')
$.getJSON('https://acapparelli.github.io/NAB_rules/rules.json', function(data) {
    populate_accordion('NABaccordion', data)
})


function populate_accordion(accordion_name, data) {
    for (const name in data) {
        let safe_name = name.replaceAll("'", '').replaceAll(' ', '').replaceAll('/', '').replaceAll('.', '')
        console.log(safe_name)
        let header_name = `${safe_name}header`
        let body_name = `${safe_name}body`
        let button_text = name
        createAccordion(accordion_name, header_name, body_name, button_text, safe_name, data[name])
    }
}

function createAccordion(accordion_name, header_name, body_name, button_text, map_prefix, list_data) {
    const map_list = new Array(`${map_prefix}Map1`, `${map_prefix}Map2`)
    const created_maps = new Array()
    const new_card = document.createElement('div')
    new_card.className = 'card'
    const card_header = document.createElement('div')
    card_header.className = 'card-header'
    card_header.setAttribute('id', header_name)
    const card_header_heading = document.createElement('h2')
    card_header_heading.className = 'mb-0'
    const header_button = document.createElement('button')
    header_button.className = 'btn btn-link'
    header_button.setAttribute('aria-controls', body_name)
    header_button.setAttribute('data-toggle', 'collapse')
    header_button.setAttribute('data-target', `#${body_name}`)
    header_button.appendChild(document.createTextNode(button_text))

    const body_div = document.createElement('div')
    body_div.className = 'collapse'
    body_div.setAttribute('id', body_name)
    body_div.setAttribute('data-parent', `#${accordion_name}`)
    const card_body = document.createElement('div')
    card_body.className = 'card-body'

    const table = document.createElement('table')
    table.className = 'table table-bordered table-hover table-striped'
    const responsive_div = document.createElement('div')
    responsive_div.className = 'table-responsive'
    const table_header = create_table_header()
    const table_body = document.createElement('tbody')
    table.appendChild(table_header)
    let row_count = 1
    list_data.forEach(element => {
        const map_id = `${map_prefix}${row_count}`
        var body_row
        if (element["coords"]) {
            body_row = create_table_row(map_id, element["start_date"], element["end_date"], true)
            created_maps.push({ "map_id": map_id, "coords": element["coords"] })
        } else {
            body_row = create_table_row(map_id, element["start_date"], element["end_date"], false)
        }
        table_body.appendChild(body_row)
    })
    table.appendChild(table_body)
    responsive_div.appendChild(table)
    card_body.appendChild(responsive_div)


    body_div.appendChild(card_body)
    card_header_heading.appendChild(header_button)
    card_header.appendChild(card_header_heading)
    new_card.appendChild(card_header)
    new_card.appendChild(body_div)
    accordionparent.appendChild(new_card)


    created_maps.forEach(element => {
        create_maps(element["map_id"], body_name, element["coords"])
    })

}

function displayMap(x, y, mapname) {
    let map = L.map(mapname).setView([x, y], 4);
    L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        subdomains: ['a', 'b', 'c']
    }).addTo(map);
    return map
}

function create_maps(map_name, body_name, coords) {
    var elem_map = displayMap(48.45, -85.58, map_name)
    $(`#${body_name}`).on('shown.bs.collapse', function(e) {
        elem_map.invalidateSize(true);
    })
    add_polygon(coords, elem_map)
}

function create_table_header() {
    const table_header = document.createElement('thead')
    const table_row = document.createElement('tr')
    const start_date_header = document.createElement('th')
    start_date_header.className = 'col-xs-3'
    start_date_header.appendChild(document.createTextNode('Start Date'))
    const end_date_header = document.createElement('th')
    end_date_header.className = 'col-xs-3'
    end_date_header.appendChild(document.createTextNode('End Date'))
    const map_header = document.createElement('th')
    map_header.className = 'col-xs-6'
    map_header.appendChild(document.createTextNode('Map'))
    table_row.appendChild(start_date_header)
    table_row.appendChild(end_date_header)
    table_row.appendChild(map_header)
    table_header.appendChild(table_row)
    return table_header
}

function create_table_row(map_name, start_date, end_date, map_defined) {
    const body_row = document.createElement('tr')
    const body_start_date = document.createElement('td')
    body_start_date.appendChild(document.createTextNode(start_date))
    const body_end_date = document.createElement('td')
    body_end_date.appendChild(document.createTextNode(end_date))
    const body_map = document.createElement('td')
    if (map_defined) {
        const map_div = document.createElement('div')
        map_div.setAttribute('id', map_name)
        map_div.className = 'maps'
        body_map.appendChild(map_div)
    } else {
        body_map.appendChild(document.createTextNode('No Map. Notable throughout the province during the listed date range.'))
    }
    body_row.appendChild(body_start_date)
    body_row.appendChild(body_end_date)
    body_row.appendChild(body_map)
    return body_row
}

function add_polygon(coords, map) {
    const polygon = L.polygon(coords, { color: 'green' })
    polygon.addTo(map)
}