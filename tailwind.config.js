/** @type {import('tailwindcss').Config} */
export default {
	content: ['./src/**/*.{html,js,svelte,ts}'],
	theme: {
		extend: {
			backgroundImage: {
				'control-pattern':
					'url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAADCCAYAAACIaaiTAAAAAXNSR0IArs4c6QAAARJJREFUOE9lyNdHBQAAhfHb3nvvuu2997jNe29TJJEkkkgSSSSJJJJEEkkiifRH5jsP56Xz8PM5gcC/xfCIWBNHiXiTQIlEk0SJZJNCiVRIM+mUyDCZlMgy2ZTIMbmUyDP5lCgwhZQoMsWUKDGllCgz5ZSogEpTRYlqU0OJoKmlRJ2pp0SDaaREk2mmRItppUSbaadEh+mkRBd0mx5K9Jo+SvSbAUoMmiFKDJsRSoyaMUqMmwlKhMwkJabMNCVmYNbMUSJsIpSImnlKLJhFSiyZZWoFVmEN1mEDNmELtmEHdmEP9uEADuEIjuEETuEMzuECLuEKruEGbuEO7uEBHuEJnuEFXuEN3uEDPuELvuEHfv8AoRErEi7Uc8UAAAAASUVORK5CYII=")'
			}
		}
	},
	plugins: []
};
