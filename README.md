# EcoMap
Ecomap is a project made by me - Catja Månsson - designed to easily illustrate data connected to ecology and hydrology.

## **Background**
The idea of Ecomap started during an academic project, when I tried to illustrate how hydrology and ecology data affected a given area. I noticed that most existing 
tools and databases were often complex and difficult to use, especially for beginners. To make this kind of data more accessible, I developed Ecomap as a way to 
structure and visualize hydrology, ecology, and field observations in a clear and understandable format.

The project focuses on three separate layers that can be analyzed independently or combined to provide an overall understanding of the environment.

## Intended Audience
EcoMap is intended for students and researchers working with ecological and hydrological spatial data who need an easy-to-use and accessible way to visualize and combine datasets.

## Project Status
EcoMap is currently in early development and primarily runs in a local development environment.

## Project components
### Hydrology
- Focuses on water levels, flow patterns, and potential flooding areas if water levels rise.
- Data comes from GIS sources and field measurements.
- This layer is visualized independently from ecological and field data.
### Ecology                      
- Describes vegetation types, habitats, and threatened species in the area.
- Data comes from national databases and literature (e.g., SLU vegetation classifications, Swedish Red List, Artfakta).
- Provides a visual and ecological context for understanding the area, independent of water measurements.
### Field Study
- Documents on-site observations, including soil samples, pH measurements, and flora/fauna surveys.
- Serves to validate and complement the data from Hydrology and Ecology.
- Example measurements include soil pH, moisture levels, and species observations.
### Custom
- This layer allows users to combine Hydrology, Ecology, and Field Study data into a single map.
- Enables custom analysis and visualization of multiple layers together.

## Tech Stack
### Frontend
- Vite-React
- Leaflet
### Backend
- Python (Flask)
- 
### Data
- GeoJSON

## Installation

### Requirements
- Node.js (v18 or later)
- npm
- Python 3.10+

### Clone the repository
```bash
git clone https://github.com/catjaamansson/ecomap.git
```
### Frontend startup
```bash
cd frontend
npm install
npm run dev
```
### Backend startup
```bash
cd backend
python run.py
```

## Screenshots
<img width="300" height="250" alt="hydrology floodlayer" src="https://github.com/user-attachments/assets/3747a8a7-46ef-49f7-8c7c-234a73dfbf63" />
<img width="300" height="250" alt="fieldstudy landuse layer" src="https://github.com/user-attachments/assets/16d3abfe-d5f9-4542-8b1f-830c340b3625" />

