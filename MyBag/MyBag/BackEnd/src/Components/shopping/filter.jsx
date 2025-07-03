import { filterOptions } from '../../config';
import React, { Fragment } from 'react';

export default function ProductFilter({ filters, handleFilter }) {
  return (
    <div className="bg-white rounded-2 shadow-sm">
      <div className="border-bottom p-4">
        <h2 className="fw-bolder font-semibold"> Filters</h2>
      </div>
      <div className="p-4 mt-4 mb-4 border-bottom">
        {Object.keys(filterOptions).map((keyItem) => (
          <Fragment key={keyItem}>
            <div>
              <h3 className="font-semibold fw-bolder border-bottom">{keyItem}</h3>
              <div className="grid gap-2 mt-2 border-bottom">
                {filterOptions[keyItem].map((option) => {
                  const checkboxId = `checkbox-${keyItem}-${option.id}`;
                  return (
                    <label
                      key={option.id}
                      className="fw-normal d-flex align-items-center gap-2"
                      htmlFor={checkboxId}
                      style={{ width: '100%', marginTop: '8px', justifyContent: 'center' }}
                    > {/* this here the label for fileter and below are the checkbox components */}
                      <div
                        className="btn-group"
                        role="group"
                        aria-label="Basic checkbox toggle button group"
                        style={{ width: '100%', justifyContent: 'center' }}
                      >
                        <input
                          type="checkbox"
                          className="btn-check"
                          id={checkboxId}
                          checked={
                            filters &&
                            Object.keys(filters).length > 0 &&
                            filters[keyItem] &&
                            filters[keyItem].indexOf(option.id) > -1
                          }
                          onChange={() => {
                            handleFilter(keyItem, option.id);
                          }}
                          autoComplete="off"
                        />
                        <label className="btn btn-outline-dark" htmlFor={checkboxId} style={{ width: '100%', textAlign: 'center' }}>
                          {option.label}
                        </label>
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          </Fragment>
        ))}
      </div>
    </div>
  );
}
