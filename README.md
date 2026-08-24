# EcoMap
EcoMap is a project made by me - Catja Månsson - designed to easily illustrate data connected to ecology and hydrology.

## **Background**
The idea of EcoMap started during an academic project, when I tried to illustrate how hydrology and ecology data affected a given area. I noticed that most existing 
tools and databases were often complex and difficult to use, especially for beginners. To make this kind of data more accessible, I developed EcoMap as a way to 
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
- JavaScript
- HTML
- CSS

### Backend
- Python (Flask)

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
<img width="400" height="300" alt="Skärmbild 2026-03-07 130409" src="https://github.com/user-attachments/assets/7b9518d7-edcf-45f4-a5c3-beca77b54e4e" />
<img width="400" height="300" alt="Skärmbild 2026-03-07 131720" src="https://github.com/user-attachments/assets/48073208-c8ad-468c-9462-b19e8fe89e1c" />
<img width="400" height="300" alt="Skärmbild 2026-03-07 130534" src="https://github.com/user-attachments/assets/21685fca-b34e-4905-a09d-9d191c124ec2" />
<img width="400" height="300" alt="Skärmbild 2026-03-07 130601" src="https://github.com/user-attachments/assets/b24ba98d-c3ed-4b77-a477-083711e544dc" />
