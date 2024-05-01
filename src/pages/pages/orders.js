import React, { useState } from 'react';
import { Card, CardHeader, CardExpandToggler, CardBody } from './../../components/card/card.jsx';
import { Icon } from '@iconify/react';
import '../../../src/index.css';

// Utility function to handle different JSON structures
const parseJsonData = (jsonData) => {
  if (jsonData.default) {  // Handle ES module default export
    jsonData = jsonData.default; // Handle ES module default export if present
  }
  // Check if jsonData is an object and not null
  if (Array.isArray(jsonData)) {
    // Check if it's directly iterable (i.e. an array)
    if (Array.isArray(jsonData)) {
      return jsonData;
    } else {
      // Convert object values to an array, assuming they are not deeply nested structures
      let values = [];
      for (let kay in jsonData) {
        if (jsonData.hasOwnProperty(key)) {
          values.push(jsonData[key]);
        }
      }
      return values;
    }
  } else {
    return [];
  }
};

// Utility function to handle different JSON structures
const checkJsonPath = (obj, path, defaultValue = "no data") => {
  return path.reduce((currentObject, key) =>
    currentObject && currentObject[key] !== undefined ? currentObject[key] : defaultValue, obj);
};


function PageItems() {

  // Govern search input
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchHistory, setSearchHistory] = useState([]);
  const [searchDatasets, setSearchDatasets] = useState([]);
  const [searchSettings, setSearchSettings] = useState([]);
  const [searchFaqs, setSearchFaqs] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  // const [searchStats, setSearchStats] = useState({ count: 0, time: 0 });

  // Update state when search input field changes
  const handleSearchChange = (e) => {
    setSearchInput(e.target.value);
  };

  const loadAndDisplayResults = async () => {
    const startTime = performance.now(); // Start timing before data loading

    try {
      // Dynamically import JSON when needed
      console.debug('Attempting to load JSON data...');
      const searchResultsData = await import('../../../src/data/searchResults.json');
      const searchHistoryData = await import('../../../src/data/searchHistory.json');
      const searchDatasetsData = await import('../../../src/data/searchDatasets.json');
      const searchSettingsData = await import('../../../src/data/searchSettings.json');
      const searchFaqsData = await import('../../../src/data/searchFaqs.json');

      // Convert loaded JSON objects to arrays using Object.value if needed
      console.debug('Data loaded, parsing JSON...');
      const resultsArray = Object.values(searchResultsData);
      const historyArray = Object.values(searchHistoryData);
      const datasetsArray = Object.values(searchDatasetsData);
      const settingsArray = Object.values(searchSettingsData);
      const faqsArray = Object.values(searchFaqsData);

      console.debug("Data parsed successfully:", {
        resultsArray,
        historyArray,
        datasetsArray,
        settingsArray,
        faqsArray
      });

      // Set state with parsed data
      setSearchResults(resultsArray);
      setSearchHistory(historyArray);
      setSearchDatasets(datasetsArray);
      setSearchSettings(settingsArray);
      setSearchFaqs(faqsArray);

      // Calculate search time
      const endTime = performance.now();
      console.log('Search completed in:', endTime - startTime, 'ms');

      // Set search stats immediately using the directly available resultsArray
      // setSearchStats({ count: resultsArray.length, time: endTime - startTime });

      // Save search to local storage for history tracking
      const history = JSON.parse(localStorage.getItem('searchHistory')) || [];
      history.push({
        searchInput,
        resultsCount: searchResults.length,
        searchTime: endTime - startTime,
        date: new Date().toISOString()
      });

      // Save the updated history back to local storage
      localStorage.setItem('searchHistory', JSON.stringify(history));
    } catch (error) {
      console.error('Failed to load or parse data:', error);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      console.log('Enter Key pressed. Initiating search...');
      loadAndDisplayResults();
    }
  };

  if (!searchHistory === 0) {
    console.log('searchHistory source is not defined or is empty');
    return;
  }

  // Handle selection of an item to display in the second <Card>
  const handleSelectedItem = (item) => {

    // If the same item is clicked again, clear selection
    if (selectedItem && selectedItem === item) {
      setSelectedItem(null);
    } else {

      // Otherwise, update the selected item
      setSelectedItem(item);
    }
  };

  return (
    <div>
      <div className="mb-md-4 mb-3 d-md-flex">
        <div className="mt-md-0 mt-2"><a href="#/" className="text-inverse text-opacity-75 text-decoration-none"><i className="fa fa-download fa-fw me-1 text-theme"></i> Export</a></div>
        <div className="ms-md-4 mt-md-0 mt-2 dropdown-toggle">
          <a href="#/" data-bs-toggle="dropdown" className="text-inverse text-opacity-75 text-decoration-none">More Actions</a>
          <div className="dropdown-menu">
            <a className="dropdown-item" href="#/">Action</a>
            <a className="dropdown-item" href="#/">Another action</a>
            <a className="dropdown-item" href="#/">Something else here</a>
            <div role="separator" className="dropdown-divider"></div>
            <a className="dropdown-item" href="#/">Separated link</a>
          </div>
        </div>
      </div>

      <div className="row gx-4">
        <div className={`col-lg-8 ${selectedItem ? '' : 'col-lg-12'}`}>
          <Card className="mb-4">
            <ul className="nav nav-tabs nav-tabs-v2 px-4">
              <li className="nav-item me-3"><a href="#searchTab" className="nav-link active px-2" data-bs-toggle="tab">Selector Search</a></li>
              <li className="nav-item me-3"><a href="#historyTab" className="nav-link px-2" data-bs-toggle="tab">History</a></li>
              <li className="nav-item me-3"><a href="#datasetsTab" className="nav-link px-2" data-bs-toggle="tab">Datasets</a></li>
              <li className="nav-item me-3"><a href="#faqTab" className="nav-link px-2" data-bs-toggle="tab">FAQ</a></li>
              <li className="nav-item me-3"><a href="#settingsTab" className="nav-link px-2" data-bs-toggle="tab">Settings</a></li>
            </ul>
            <div className="tab-content-flex tab-content p-4">
              <div className="tab-pane fade show active" id="searchTab">
                <p>Enter one or more space delimited selectors or drag/drop a CSV file for bulk.</p>
                <div className="input-group mb-4">
                  <div className="flex-fill position-relative">
                    <div className="input-group">
                      <input
                        type="text"
                        className="form-control px-35px"
                        placeholder="Enter one or more space delimited selectors . . ."
                        value={searchInput}
                        onChange={handleSearchChange}
                        onKeyDown={handleKeyDown}
                      />
                      <div className="input-group-text position-absolute top-0 bottom-0 bg-none border-0 start-0" style={{ zIndex: 1020 }}>
                        <i className="fa fa-search opacity-5"></i>
                      </div>
                    </div>
                  </div>
                  <button onClick={loadAndDisplayResults} className="btn btn-outline-default" type="button"><span className="d-none d-md-inline">Search</span><span className="d-inline d-md-none"><i className="fa fa-credit-card"></i></span> &nbsp;</button>
                  <button className="btn btn-outline-default dropdown-toggle rounded-0" type="button" data-bs-toggle="dropdown"><span className="d-none d-md-inline">Advanced</span><span className="d-inline d-md-none"><i className="fa fa-credit-card"></i></span> &nbsp;</button>
                  <div className="dropdown-menu">
                    <a className="dropdown-item" href="#/">graph_walker</a>
                    <a className="dropdown-item" href="#/">degrees</a>
                    <a className="dropdown-item" href="#/">supernode</a>
                    <div role="separator" className="dropdown-divider"></div>
                    <a className="dropdown-item" href="#/">Separated link</a>
                  </div>
                  <button className="btn btn-outline-default" type="button"><span className="d-none d-md-inline">Upload CSV</span><span className="d-inline d-md-none"><i className="fa fa-check"></i></span> &nbsp;</button>
                </div>

                <div className="intro row">
                  <h1>Welcome to GL2!</h1>
                  <p>GL2 introduces more datasets with less complexity.</p>
                </div>

                <div className="table-responsive responsive-flex">
                  <table className="table table-hover table-borderless text-nowrap">
                    <thead>
                      <tr>
                        <th className="border-top-0 pt-0 pb-2">Input ID</th>
                        <th className="border-top-0 pt-0 pb-2">Type</th>
                        <th className="border-top-0 pt-0 pb-2">1st Seen</th>
                        <th className="border-top-0 pt-0 pb-2">Last Seen</th>
                        <th className="border-top-0 pt-0 pb-2">Count</th>
                        <th className="border-top-0 pt-0 pb-2">Dataset</th>
                        <th className="border-top-0 pt-0 pb-2">Selector A</th>
                        <th className="border-top-0 pt-0 pb-2">Selector B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {searchResults.map((item, index) => (
                        <tr
                          key={index}
                          onClick={() => setSelectedItem(selectedItem === item ? null : item)}
                          className={selectedItem === item ? 'active' : ''}
                          style={{ cursor: 'pointer' }}
                        >
                          <td className="align-middle">{item.in?.vid}</td>
                          <td className="align-middle">{item.in?.vtype}</td>
                          <td className="align-middle">{item.edge?.firstseen}</td>
                          <td>{item.edge?.lastseen}</td>
                          <td className="py-1 align-middle"><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> {item.edge?.ecount}</span></td>
                          <td className="align-middle"><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center"><i className="fa fa-circle fs-9px fa-fw me-5px"></i> {item.edge?.esource}</span></td>
                          <td className="align-middle">{item.out?.vid}</td>
                          <td className="align-middle">{item.out?.vuuid}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tab-pane fade show" id="historyTab">
                <h2>History</h2>
                <div className="table-responsive">
                  <table className="table table-hover table-borderless text-nowrap">
                    <thead>
                      <tr>
                        <th className="border-top-0 pt-0 pb-2">Input ID</th>
                        <th className="border-top-0 pt-0 pb-2">Type</th>
                        <th className="border-top-0 pt-0 pb-2">1st Seen</th>
                        <th className="border-top-0 pt-0 pb-2">Last Seen</th>
                        <th className="border-top-0 pt-0 pb-2">Count</th>
                        <th className="border-top-0 pt-0 pb-2">Dataset</th>
                        <th className="border-top-0 pt-0 pb-2">Item A</th>
                        <th className="border-top-0 pt-0 pb-2">Item B</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SearchHistory.map((item, index) => (
                        <tr key={index}>
                          <td className="align-middle">{item?.system}</td>
                          <td className="align-middle">{item?.attempts}</td>
                          <td className="align-middle">{item?.auth.org}</td>
                          <td className="align-middle">{item?.auth.user}</td>
                          <td className="align-middle">{item?.class}</td>
                          <td className="align-middle"><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">{item?.failures}</span></td>
                          <td className="align-middle">{item?.inputs}</td>
                          <td className="align-middle">{item?.jobs}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tab-pane fade show" id="datasetsTab">
                <h2>Datasets</h2>
                <div className="table-responsive">
                  <table className="table table-hover table-borderless text-nowrap">
                    <thead>
                      <tr>
                        <th className="border-top-0 pt-0 pb-2">Dataset</th>
                        <th className="border-top-0 pt-0 pb-2">Type</th>
                        <th className="border-top-0 pt-0 pb-2">Org</th>
                        <th className="border-top-0 pt-0 pb-2">Status</th>
                        <th className="border-top-0 pt-0 pb-2">Actionability</th>
                        <th className="border-top-0 pt-0 pb-2">Date Range</th>
                        <th className="border-top-0 pt-0 pb-2">Correlations</th>
                        <th className="border-top-0 pt-0 pb-2">Communications</th>
                        <th className="border-top-0 pt-0 pb-2">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {SearchDatasets.map((item, index) => (
                        <tr key={index}>
                          <td className="align-middle">{item?.dataset}</td>
                          <td className="align-middle">{item?.id}</td>
                          <td className="align-middle">{item?.type}</td>
                          <td className="align-middle">{item?.org}</td>
                          <td className="align-middle"><span className="badge border border-success text-success px-2 pt-5px pb-5px rounded fs-12px d-inline-flex align-items-center">{item?.status}</span></td>
                          <td className="align-middle">{item?.actionability}</td>
                          <td className="align-middle">{item?.earliest_load_date} - {item?.latest_load_date}</td>
                          <td className="align-middle">{item?.total_weight}</td>
                          <td className="align-middle">{item?.dataset.total_users}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="tab-pane fade show" id="faqTab">
                <h2>FAQ</h2>
                <p>FAQ explanation</p>
                <div className="accordion" id="faqAccordion">
                  {Object.entries(searchFaqs).map(([header, faqs], sectionIndex) => (
                    <div key={sectionIndex}>
                      <h2>{header}</h2>
                      <div className="accordion" id={`section${sectionIndex}Accordion`}>
                        {faqs.map((faq, index) => (
                          <div className="accordion-item" key={index}>
                            <h2
                              className="accordion-header"
                              id={`heading${sectionIndex}-${index}`}>
                              <button
                                className="accordion-button"
                                type="button"
                                data-bs-toggle="collapse"
                                data-bs-target={`#collapse${sectionIndex}-${index}`}>
                                {faq?.question}
                              </button>
                            </h2>
                            <div
                              id={`collapse${sectionIndex}-${index}`}
                              className="accordion-collapse collapse"
                              aria-labelledby={`heading${sectionIndex}-${index}`}
                              data-bs-parent={`#section${sectionIndex}Accordion`}>
                              <div className="accordion-body">
                                {faq?.answer}
                                {faq?.link && <a href={faq.link?.href}>{faq.link?.label}</a>}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="tab-pane fade show" id="settingsTab">
                <h2>Settings coming soon</h2>
              </div>

            </div>
          </Card>
        </div>

        <div className={`col-lg-4 ${selectedItem ? '' : 'd-none'}`}>
          <Card className="mb-4">
            <CardHeader className="fw-bold small-flex">
              <span className="flex-grow-1">DETAILS</span>
              <CardExpandToggler />
            </CardHeader>
            <CardBody>
              {selectedItem ? (
                <>
                  <h5 className="card-title">{selectedItem.in?.vid}</h5>
                  <h6 className="card-subtitle mb-3 text-white text-opacity-50">Card subtitle</h6>
                  <p className="card-text mb-3"><strong>Type:</strong> {selectedItem.in?.vtype}</p>
                  <p className="card-text mb-3"><strong>First Seen:</strong> {selectedItem.edge?.firstseen}</p>
                  <p className="card-text mb-3"><strong>Last Seen:</strong> {selectedItem.edge?.lastseen}</p>
                  <p className="card-text mb-3"><strong>Count:</strong> {selectedItem.edge?.ecount}</p>
                  <p className="card-text mb-3"><strong>Source:</strong> {selectedItem.edge?.esource}</p>
                  <p className="card-text mb-3"><strong>Vendor ID (Out):</strong> {selectedItem.out?.vid}</p>
                  <p className="card-text mb-3"><strong>UUID (Out):</strong> {selectedItem.out?.vuuid}</p>
                  <div>
                    <a href="#/" className="card-link">Card link</a>
                    <a href="#/" className="card-link">Another link</a>
                  </div>
                </>
              ) : (
                <div className="card-body">
                  <p>No item selected</p>
                </div>
              )}
            </CardBody>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default PageItems;
