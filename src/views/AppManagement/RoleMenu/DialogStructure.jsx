import React from 'react'

import { DialogContent, Grid, IconButton } from '@mui/material'

import { Close } from '@mui/icons-material'

export default function DialogStructure(props) {
  const RecursiveNestedList = ({ items }) => {
    return (
      <>
        <ul>
          {items.map((item, index) => (
            <React.Fragment key={index}>
              {item.submenus.length !== 0 ? (
                <li>
                  <div className="d-flex align-items-center">
                    {item.name}
                  </div>

                  <RecursiveNestedList items={item.submenus} />
                </li>
              ) : (
                <li>
                  <div className="d-flex align-items-center">
                    {item.name}
                  </div>
                </li>
              )}
            </React.Fragment>
          ))}
        </ul>
      </>
    )
  }

  return (
    <DialogContent>
      <div className="customP">
        <Grid container direction="row" alignItems="center">
          <Grid item xs={6}>
            <p className="font-24 font-bold">Structure Menu</p>
          </Grid>
          <Grid item xs={6} className="text-right">
            <IconButton
              onClick={() => props.closeDialog()}
              size="small"
              style={{ height: '16px' }}
            >
              <Close className="font-16"></Close>
            </IconButton>
          </Grid>
        </Grid>

        <Grid container direction="row" className="mt-24">
          <Grid item xs={12} className="list-style-none">
            {props.structureMenu.length > 0 && (
              <RecursiveNestedList items={props.structureMenu} />
            )}
          </Grid>
        </Grid>
      </div>
    </DialogContent>
  )
}
