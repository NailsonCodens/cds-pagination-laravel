module.exports = {
	props: {
		source: {
			type: Object,
			default: function() {
				return {
					current_page: 1,
					data: [],
					from: 1,
					last_page: 1,
					next_page_url: null,
					per_page: 10,
					prev_page_url: null,
					to: 1,
					total: 0,
				}
			}
		},
	},

	data: function () {
		return {
			pages: [],
			elipse: '...',
		}
	},

	methods: {

		navigate (ev, page) {
			ev.preventDefault();
			this.$emit('navigate', page);
		},

		nextPrev (ev, page) {
			
			if(page == 0 || page == this.source.last_page + 1){
				return;
			}
			ev.preventDefault();
			this.$emit('navigate', page);
		},

		generatePagesArray: function(currentPage, collectionLength, rowsPerPage, paginationRange)
		{
		    var pages = [];
		    var totalPages = Math.ceil(collectionLength / rowsPerPage);
		    var halfWay = Math.ceil(paginationRange / 2);
		    var position;

		    if (currentPage <= halfWay) {
		        position = 'start';
		    } else if (totalPages - halfWay < currentPage) {
		        position = 'end';
		    } else {
		        position = 'middle';
		    }

		    var ellipsesNeeded = paginationRange < totalPages;
		    var i = 1;
		    while (i <= totalPages && i <= paginationRange) {
		        var pageNumber = this.calculatePageNumber(i, currentPage, paginationRange, totalPages);
		        var openingEllipsesNeeded = (i === 2 && (position === 'middle' || position === 'end'));
		        var closingEllipsesNeeded = (i === paginationRange - 1 && (position === 'middle' || position === 'start'));
		        if (ellipsesNeeded && (openingEllipsesNeeded || closingEllipsesNeeded)) {
		            pages.push('...');
		        } else {
		            pages.push(pageNumber);
		        }
		        i ++;
		    }
		    return pages;
		},

		calculatePageNumber: function(i, currentPage, paginationRange, totalPages)
		{
		    var halfWay = Math.ceil(paginationRange/2);
		    if (i === paginationRange) {
		        return totalPages;
		    } else if (i === 1) {
		        return i;
		    } else if (paginationRange < totalPages) {
		        if (totalPages - halfWay < currentPage) {
		        return totalPages - paginationRange + i;
		    } else if (halfWay < currentPage) {
		        return currentPage - halfWay + i;
		    } else {
		        return i;
		    }
		    } else {
		        return i;
		    }
		},
	},

	watch: {
		source(){
			let src = this.source;

			this.pages = this.generatePagesArray(src.current_page, src.total, src.per_page, 10);
		}
	},	

	template: '<ul class="pagination">\
		<li :class="{ disabled: source.current_page == 1 }">\
		<a v-on:click="nextPrev($event, source.current_page-1)" aria-label="Previous"><span aria-hidden="true">&laquo;</span></a>\
		</li>\
		<li v-for="page in pages" trackby="$index" :class="{ active: source.current_page == page }">\
			<span class="none" v-if="page == elipse">{{ page }}</span>\
			<a href="#" v-if="page != elipse" v-on:click="navigate($event, page)">{{ page }}</a>\
		</li>\
		<li :class="{ disabled: source.current_page == source.last_page }">\
			<a v-on:click="nextPrev($event, source.current_page+1)" aria-label="Next"><span aria-hidden="true">&raquo;</span></a>\
		</li>\
	</ul>',
};
